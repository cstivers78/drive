var Application, main;

Application = require('./application');

main = {
  app: new Application(require.main)
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

Object.defineProperty(global, 'controllers', {
  get: function() {
    return main.app.controllers;
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
