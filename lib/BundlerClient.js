/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

// TODO: this should be part of the consumer
// const { replace } = require('./client-hmr');

const { init: initProgress } = require('./overlays/progress');
const { init: initMinimalProgress } = require('./overlays/progress-minimal');
const { init: initStatus } = require('./overlays/status');

class BundlerServeClient {
  constructor() {
    window.bundlerServe = this;

    // eslint-disable-next-line no-undef, no-unused-vars
    const options = ʎɐɹɔosǝʌɹǝs;
    const { address, client, secure } = options;
    const protocol = secure ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${(client || {}).address || address}/wps`);
    const log = this.getLogger(options.log || {});

    // prevents ECONNRESET errors on the server
    window.addEventListener('beforeunload', () => socket.close());

    socket.addEventListener('message', (message) => {
      const { action, data } = JSON.parse(message.data);
      this.socketMessage(action, data);
    });

    socket.onclose = () => log.warn(`The client WebSocket was closed. ${log.refresh}`);

    Object.assign(this, { log, options, socket });

    this.setupProgress();
    this.setupStatus();

    // TODO: override in consumer
    // if (module.hot) {
    //   info('Hot Module Replacement is active');
    //
    //   if (options.liveReload) {
    //     info('Live Reload taking precedence over Hot Module Replacement');
    //   }
    // } else {
    //   warn('Hot Module Replacement is inactive');
    // }
    //
    // if (!module.hot && options.liveReload) {
    //   info('Live Reload is active');
    // }
  }

  getLogger() {
    const { error, info, warn } = console;
    const options = this.options.log;
    const logName = options.name || 'bundler';
    const { ok } = options.symbols || { ok: '🞎', whoops: '▣' };

    return {
      // TODO: use log options
      error: error.bind(console, `${ok} ${logName}:`),
      info: info.bind(console, `${ok} ${logName}:`),
      refresh: 'Please refresh the page',
      warn: warn.bind(console, `${ok} ${logName}:`)
    };
  }

  setupProgress() {
    const { options, socket } = this;
    const { progress } = options;

    if (progress === 'minimal') {
      initMinimalProgress(options, socket);
    } else if (progress) {
      initProgress(options, socket);
    }
  }

  setupStatus() {
    const { options, socket } = this;
    const { status } = options;

    if (status) {
      initStatus(options, socket);
    }
  }

  socketMessage(action, data) {
    const { errors, hash = '<?>', warnings } = data || {};
    const shortHash = hash.slice(0, 7);

    switch (action) {
      case 'connected':
        this.log.info('WebSocket connected');
        break;
      case 'errors':
        this.log.error(`Build ${shortHash} produced errors:\n`, errors);
        break;
      case 'reload':
        window.location.reload();
        break;
      // TODO: override in consumer
      // case 'replace':
      //   replace(hash);
      //   break;
      case 'warnings':
        this.log.warn(`Build ${shortHash} produced warnings:\n`, warnings);
        break;
      default:
    }
  }
}

module.exports = { BundlerServeClient };
