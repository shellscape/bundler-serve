/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const EventEmitter = require('events');

const captialize = require('titleize');
const router = require('koa-route');

/* eslint-disable class-methods-use-this */
class BundlerRouter extends EventEmitter {
  prepSocketData(data) {
    return JSON.stringify(data);
  }

  setupRoutes() {
    const { app } = this;
    const events = ['compile', 'done', 'invalid', 'progress'];
    const connect = async (ctx) => {
      if (ctx.ws) {
        const socket = await ctx.ws();

        for (const event of events) {
          const handler = this[`socket${captialize(event)}`].bind(this, socket);
          this.on(event, handler);

          socket.on('close', () => {
            this.removeListener(event, handler);
          });
        }

        socket.send(this.prepSocketData({ action: 'connected' }));
      }
    };

    app.use(router.get('/wps', connect));
  }

  socketCompile(socket, compilerName = '<unknown>') {
    socket.send(this.prepSocketData({ action: 'compile', data: { compilerName } }));
  }

  // eslint-disable-next-line no-unused-vars
  socketDone(socket) {
    // TODO: override in consumer
    // const statsOptions = {
    //   all: false,
    //   cached: true,
    //   children: true,
    //   hash: true,
    //   modules: true,
    //   timings: true,
    //   exclude: ['node_modules', 'bower_components', 'components']
    // };
    // const { hash } = stats;
    //
    // if (socket.lastHash === hash) {
    //   return;
    // }
    //
    // socket.lastHash = hash;
    // const { errors = [], warnings = [] } = stats.toJson(statsOptions);
    // const stripAnsi = require('strip-ansi');
    //
    // if (errors.length || warnings.length) {
    //   socket.send(
    //     this.prepSocketData({
    //       action: 'problems',
    //       data: {
    //         errors: errors.slice(0).map((e) => stripAnsi(e)),
    //         hash,
    //         warnings: warnings.slice(0).map((e) => stripAnsi(e))
    //       }
    //     })
    //   );
    //
    //   return;
    // }
    //
    // if (options.hmr || options.liveReload) {
    //   const action = options.liveReload ? 'reload' : 'replace';
    //   socket.send(prep({ action, data: { hash } }));
    // }
  }

  socketInvalid(socket, filePath = '<unknown>') {
    if (socket.readyState === 3) {
      return;
    }

    const fileName = filePath.replace(context, '');

    socket.send(this.prepSocketData({ action: 'invalid', data: { fileName } }));
  }

  socketProgress(socket, data) {
    socket.send(socket, this.prepSocketData({ action: 'progress', data }));
  }
}

module.exports = { BundlerRouter };
