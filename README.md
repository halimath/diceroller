# diceroller

[![CI Status](https://github.com/halimath/diceroller/workflows/CI/badge.svg)](https://github.com/halimath/diceroller/actions/workflows/ci.yml)
[![CD Status](https://github.com/halimath/diceroller/workflows/CD/badge.svg)](https://github.com/halimath/diceroller/actions/workflows/cd.yml)


A progressive web application for rolling dice of the [SW role playing game series](https://www.fantasyflightgames.com/en/starwarsrpg/).

The app is online available at [https://diceroller.wilanthaou.de/](https://diceroller.wilanthaou.de/).

## Development

The PWA is built using
* [TypeScript](https://www.typescriptlang.org/)
* [wecco](https://bitbucket.org/wecco/core/src/master/)
* [material-css](https://materializecss.com/)

You need to have `node` and `npm` installed to develop the app.

Run 

```
$ npm i
```

to install all dependencies then

```
$ npm start
```

to start the webpack dev server for local development. The app is served at [http://localhost:9999](http://localhost:9999).

To run the tests, run

```
$ npm test
```

To running the lint run the following command
```
$ npm run lint
```

## License

This project is licensed under the Apache License V2.