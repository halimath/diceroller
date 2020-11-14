# diceroller

A rust library and web-app for rolling dice of the 
[SW role playing game series](https://www.fantasyflightgames.com/en/starwarsrpg/).

The app is online available at 
[https://diceroller.wilanthaou.de/](https://diceroller.wilanthaou.de/).

## Development

This project is both a convenient utility for online role playing sessions as well as
an evaluation of the following technologies and their interaction:

* [Rust](https://www.rust-lang.org/)
* [WASM](https://webassembly.org/)
* [Seed](https://webassembly.org/) is used to build the WASM SPA
* [basic-http-server](https://github.com/brson/basic-http-server)
* [Docker](https://www.docker.com/)

In order to build the app, you need the following tools installed:

* `rust` toolchain including `cargo` with at least the `wasm32-unknown-unknown` target 
installed (use [`rustup`](https://rustup.rs/) to install rust toolchain and target).
* [`wasm-pack`](https://rustwasm.github.io/wasm-pack/installer/) is used to build and 
bundle the WASM module.
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
$ wasm-pack build --target web
```

### Run the webpack development server

```bash
$ basic-http-server
```

You can keep this process runing while making changes to the code and run `wasm-pack 
build` in a second terminal window.

### Build the webapp (production mode)

```bash
$ cd app
$ wasm-pack build --target web --release
$ docker build -t diceroller:latest .
$ docker run --rm -it -p 8080:80 diceroller:latest
```

## License

The project is licensed under both the Apache License Version 2 and the MIT license.

