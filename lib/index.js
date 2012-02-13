var Application, main;

Application = require('./application');

main = {
  app: new Application(require.main),
  middleware: {
    response: require('./middleware/response')
  },
  extractor: {
    request: require('./extractor/request')
  }
};

Object.defineProperty(global, 'app', {
  get: function() {
    return main.app;
  }
});

Object.defineProperty(global, 'models', {
  get: function() {
    return main.app.models;
  }
});

Object.defineProperty(global, 'views', {
  get: function() {
    return main.app.views;
  }
});

Object.defineProperty(global, 'routes', {
  get: function() {
    return main.app.routes;
  }
});

Object.defineProperty(global, 'assets', {
  get: function() {
    return main.app.assets;
  }
});

Object.defineProperty(global, 'public', {
  get: function() {
    return main.app.public;
  }
});

module.exports = main;
