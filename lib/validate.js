/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const Joi = require('joi');

const joi = new Proxy(Joi, {
  get(o, name) {
    return o[name].bind(o);
  }
});
const { allow, array, boolean, forbidden, func, number, object, string, validate } = joi;

module.exports = {
  validate(options) {
    const keys = {
      client: [allow(null), object().keys({ address: string() })],
      compress: [allow(null), boolean()],
      historyFallback: [boolean(), object()],
      hmr: boolean(),
      host: [string(), func()],
      http2: [boolean(), object()],
      https: object(),
      liveReload: boolean(),
      log: object().keys({ level: string(), timestamp: boolean() }),
      middleware: func(),
      open: [boolean(), object()],
      port: [
        number()
          .integer()
          .max(65535),
        func()
      ],
      progress: [boolean(), string().valid('minimal')],
      secure: forbidden(),
      static: [allow(null), string(), array().items(string())],
      status: boolean()
    };
    const schema = object().keys(keys);

    const results = validate(options, schema);

    return results;
  }
};
