# diceroller

A library/web-app for rolling dice of the 
[SW role playing game series](https://www.fantasyflightgames.com/en/starwarsrpg/).

## I just want to use the web app
[diceroller.wilanthaou.de](http://diceroller.wilanthaou.de/)

## I'm a develolper

This project has been implemented using the following technologies:

* [Rust](https://www.rust-lang.org/) is used as the programming language. The core 
  library providing the different dice type, symbols and aggregation logic can be used
  for any rust project (a demo CLI is provided). The library is also used as part of an
  [WASM](https://webassembly.org/) single page application.
* [Seed](https://webassembly.org/) is used to build the WASM SPA.
* [webpack](https://webpack.js.org/) is used for assembling the bootstrap Javascript 
  code.
* [Docker](https://www.docker.com/) is used to run the webapp in a containerized 
environment.

In order to build the app, you need the following tools installed:

* `rust` toolchain including `cargo` with at least the `wasm32-unknown-unknown` target 
installed (use [`rustup`](https://rustup.rs/) to install rust toolchain and target).
* [`wasm-pack`](https://rustwasm.github.io/wasm-pack/installer/) is used to build and 
bundle the WASM module.
* [nodejs](https://nodejs.org/en/) incl. `npm` is used to install `webpack` and run the 
assembly
* [`docker`](https://www.docker.com/) if you want to build/run the container image

You should also have a text editor/IDE that supports at least Rust and web technologies 
(html/css/js). [Visual Studio Code](https://code.visualstudio.com/) is an excellent 
choice to get startet.

### Running the CLI

```bash
$ cd swrpgdiceroller
$ cargo run
```

### Build the WASM package

```bash
$ cd app
$ wasm-pack build
```

### Run the webpack development server

```bash
$ cd app/www
$ npm start
```

You can keep this process runing while making changes to the code and run `wasm-pack 
build` in a second terminal window.

### Build the webapp (production mode)

```bash
$ cd app
$ wasm-pack build
$ cd ../www
$ npm run build
```

If you want to build the docker image run the following _after_ the previous steps:

```bash
$ docker build -t diceroller:latest .
$ docker run --rm -it -p 8080:80 diceroller:latest
```

## License

The project is licensed under both the Apache License Version 2 and the MIT license.

