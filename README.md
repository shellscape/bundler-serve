[tests]: 	https://img.shields.io/circleci/project/github/shellscape/bundler-serve.svg
[tests-url]: https://circleci.com/gh/shellscape/bundler-serve

[cover]: https://codecov.io/gh/shellscape/bundler-serve/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/shellscape/bundler-serve

[size]: https://packagephobia.now.sh/badge?p=bundler-serve
[size-url]: https://packagephobia.now.sh/result?p=bundler-serve

[https]: https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
[http2]: https://nodejs.org/api/http2.html#http2_http2_createserver_options_onrequesthandler
[http2tls]: https://nodejs.org/api/http2.html#http2_http2_createsecureserver_options_onrequesthandler

<div align="center">
	<img width="256" src="https://raw.githubusercontent.com/shellscape/bundler-serve/master/assets/bundler-serve.svg?sanitize=true" alt="bundler-serve"><br/><br/>
</div>

[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![size][size]][size-url]

# bundler-serve

A Platform for Bundler Development Servers

<a href="https://www.patreon.com/shellscape">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

_Please consider donating if you find this project useful._

## Requirements

`bundler-serve` is an [evergreen 🌲](./.github/FAQ.md#what-does-evergreen-mean) module.

This module requires Node v10+. The client scripts in this module require [browsers which support `async/await`](https://caniuse.com/#feat=async-functions). Users may also choose to compile the client script via an appropriately configured [Babel](https://babeljs.io/) bundler loader/plugin for use in older browsers.

## Install

Using npm:

```console
npm bundler-serve --save
```

## Usage

TODO

## Options

TODO

## Meta

[CONTRIBUTING](./.github/CONTRIBUTING.md)

[LICENSE (Mozilla Public License)](./LICENSE)
