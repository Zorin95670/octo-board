# octo-board

Octo-board view, to view all project version from octo-spy.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Run your unit tests
```
npm run test:unit
```

### Generate documentation
```
npm run doc
```

This command will generate a `docs` directory. It contains all documentation, show index.html for start.

To write documentation see [Documentation Reference](https://esdoc.org/manual/tags.html)

### Docker

Build image:

```
docker build --build-arg NPM_TOKEN=${NPM_TOKEN} -t octo-board
```
NPM_TOKEN refer to internal registry.

Use image:
```
docker run -p 80:80 --rm -ti octo-board
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
