/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const url = require('url');

const open = require('opn');

const { getBuiltins } = require('./middleware');
const { BundlerRouter } = require('./BundlerRouter');

class BundlerServer extends BundlerRouter {
  middleware() {
    const { app, options } = this;
    return getBuiltins(app, options);
  }

  select(callback) {
    const { options } = this;
    /* eslint-disable global-require */
    const types = {
      http: require('http').createServer,
      https: require('https').createServer,
      http2: require('http2').createServer,
      http2Secure: require('http2').createSecureServer
    };
    const { http2, https } = options;
    let server;
    let secure = false;

    if (http2) {
      if (http2 === true) {
        server = types.http2({}, callback);
      } else if (http2.cert) {
        secure = true;
        server = types.http2Secure(http2, callback);
      } else {
        server = types.http2(http2, callback);
      }
    } else if (https) {
      secure = true;
      server = types.https(https === true ? {} : https, callback);
    } else {
      server = types.http(callback);
    }

    return { secure, server };
  }

  async start() {
    if (this.listening) {
      return;
    }

    const { app, options } = this;
    const { host, port } = this.options;
    const builtins = this.middleware();

    options.host = await host();
    options.port = await port();

    // allow users to add and manipulate middleware in the config
    await options.middleware(app, builtins);

    // call each of the builtin middleware. methods are once'd so this has no ill-effects.
    for (const fn of Object.values(builtins)) {
      if (!fn.skip) {
        fn();
      }
    }

    this.setupRoutes();

    const { secure, server } = this.select(app.callback());
    const emitter = this;

    this.options.secure = secure;
    server.listen({ host: this.options.host, port: this.options.port });

    // wait for the server to fully spin up before asking it for details
    await {
      then(r, f) {
        server.on('listening', () => {
          emitter.emit('listening', server);
          r();
        });
        server.on('error', f);
      }
    };

    this.listening = true;

    const protocol = secure ? 'https' : 'http';
    const address = server.address();

    address.hostname = address.address;

    // we set this so the client can use the actual hostname of the server. sometimes the net
    // will mutate the actual hostname value (e.g. :: -> [::])
    this.options.address = url.format(address);

    const uri = `${protocol}://${url.format(this.options.address)}`;

    this.log.info('Server Listening on:', uri);

    this.once('done', () => {
      if (this.options.open) {
        open(uri, this.options.open === true ? {} : this.options.open);
      }
    });
  }
}

module.exports = { BundlerServer };
