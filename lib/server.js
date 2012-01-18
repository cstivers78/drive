var Server, compiler, express, fs, getHandler, path, routes, _;

_ = require('underscore');

express = require('express');

compiler = require('./compiler');

routes = require('./routes');

path = require('path');

fs = require('fs');

getHandler = function(app, route) {
  var controller, part, parts, _i, _len;
  parts = route.handler.file.split('/');
  controller = app.controllers;
  for (_i = 0, _len = parts.length; _i < _len; _i++) {
    part = parts[_i];
    controller = controller != null ? controller[part] : void 0;
  }
  return function(req, res, next) {
    return controller[route.handler.name](req, res, next);
  };
};

module.exports = Server = (function() {

  function Server(app) {
    var mode, server;
    server = express.createServer();
    mode = process.env.NODE_ENV || 'development';
    server.use(express.errorHandler({
      stack: true,
      message: true,
      dump: true
    }));
    server.use(express.logger());
    if (mode === 'development') {
      server.use(express.profiler());
      server.use(express.responseTime());
    }
    server.use(require('./middleware/drive')());
    server.use(require('./middleware/assets')({
      path: app.assets.path,
      compilers: [new (require('./compiler/coffee')), new (require('./compiler/less'))]
    }));
    server.use(require('./middleware/views')({
      path: app.views.path,
      minify: true
    }));
    server.use(express.bodyParser());
    routes(app.conf.routes.path).forEach(function(route) {
      var handler;
      handler = getHandler(app, route);
      if (route.method && route.uri && (handler != null)) {
        switch (route.method) {
          case 'GET':
            return server.get.call(server, route.uri, handler);
          case 'DELETE':
            return server.del.call(server, route.uri, handler);
          case 'POST':
            return server.post.call(server, route.uri, handler);
          case 'PUT':
            return server.put.call(server, route.uri, handler);
        }
      }
    });
    server.use(express.static(app.public.path, {
      maxAge: 60 * 1000
    }));
    server.use(express.static(app.assets.path, {
      maxAge: 60 * 1000
    }));
    this.app = app;
    this.server = server;
    this.mode = mode;
  }

  Server.prototype.listen = function(port, addr) {
    this.server.listen(port, addr);
    return this;
  };

  return Server;

})();
