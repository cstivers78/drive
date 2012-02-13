var Server, compiler, express, fs, getHandler, middleware, path, router, util, _;

_ = require('underscore');

express = require('express');

router = require('./router');

middleware = require('./middleware');

compiler = require('./compiler');

util = require('util');

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

Server = (function() {

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
    server.use(middleware.drive());
    server.use(middleware.assets({
      path: app.assets._path,
      compilers: [new compiler.Coffee, new compiler.Less]
    }));
    server.use(middleware.views({
      path: app.views._path,
      minify: true
    }));
    server.use(middleware.locale({
      locales: app.conf.locales
    }));
    server.use(express.cookieParser());
    server.use(express.bodyParser());
    if (app.conf[mode]) app.conf[mode].configure(app, server, express);
    _.values(app.routes);
    server.use(middleware.route(app.router));
    server.use(express.static(app.assets._path, {
      maxAge: 60 * 1000
    }));
    this.app = app;
    this.server = server;
    this.mode = mode;
  }

  Server.prototype.listen = function(port, addr) {
    if (addr == null) addr = 'localhost';
    console.info("Listening on " + addr + ":" + port);
    this.server.listen(port, addr);
    return this;
  };

  return Server;

})();

module.exports = Server;
