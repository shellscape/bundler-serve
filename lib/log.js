/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const chalk = require('chalk');
const loglevel = require('loglevelnext');

const colors = {
  trace: 'cyan',
  debug: 'magenta',
  info: 'blue',
  warn: 'yellow',
  error: 'red'
};

const getLogger = (options) => {
  const { name: logName, symbols } = options;
  const prefix = {
    level: ({ level }) => {
      const color = colors[level];
      const symbol = ['error', 'warn'].includes(level) ? symbols.whoops : symbols.ok;
      return chalk[color](`${symbol} ${logName}: `);
    },
    template: '{{level}}'
  };

  if (options.timestamp) {
    prefix.template = `[{{time}}] ${prefix.template}`;
  }

  /* eslint-disable no-param-reassign */
  options.prefix = prefix;
  options.name = logName;

  const log = loglevel.create(options);

  return log;
};

const fatal = (options, ...args) => {
  const { error } = console;
  const logName = options.log.name || 'bundler';
  error(chalk.red(`▣ ${logName}:`), ...args);
};

module.exports = { fatal, getLogger };
