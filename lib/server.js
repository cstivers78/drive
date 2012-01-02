const _ = require('underscore');
const express = require('express');
const middleware = require('./middleware');
const path = require('path');

const cleanhandler = function(app) {
  return function(handler) {
    var e, h, p;
    if (_.isFunction(handler)) {
      return handler;
    } 
    else if (_.isString(handler)) {
      p = handler.split('.');
      e = _.find(app.controllers.list(),function(c) {
        return c.split('.')[0] === p[0];
      });
      if ( e ) {
        controller = app.controllers.require(e);
        return controller[p[1]];
      }
    } 
    else {
      return;
    }
  };
};

const cleanhandlers = function(app, handlers) {
  if (_.isArray(handlers)) {
    return _.without(_.map(handlers, cleanhandler(app)), void 0);
  } 
  else if (_.isFunction(handlers)) {
    return _.without([handlers], void 0);
  } 
  else if (_.isString(handlers)) {
    return _.without([cleanhandler(app)(handlers)], void 0);
  } 
  else {
    return [];
  }
};

const createServer = function(app) {

  const server = express.createServer();
  const mode = process.env.NODE_ENV || 'development';

  /**
   * Global Configurations
   */
  server.use(express.errorHandler({
    stack: true,
    message: true,
    dump: true
  }));
  server.use(express.logger());
  // server.use(express.profiler());
  // server.use(express.responseTime());
  server.use(middleware.drive());
  server.use(middleware.compiler({
    source: app.assets.basepath,
    target: app.resolve('build/assets'),
    compilers: [
      require('./compiler').coffee(), 
      require('./compiler').less()
    ]
  }));
  server.use(middleware.renderer({
    views: app.views.basepath
  }));

  /**
   * Application Configurations
   */

  if ( app.configs.existsSync(mode) ) {
    app.configs.require(mode).configure(app,server,express);
  }

  /**
   * Application Routing
   */
  server.use(express.router(function(server){
    app.routes.forEach(function(route) {
      const method = route[0], path = route[1], handler = route[2];
      if ( method && path && handler ) {
        const args = cleanhandlers(app, handler);
        args.unshift(path);
        
        switch (method) {
          case 'GET':
            return server.get.apply(server, args);
          case 'DELETE':
            return server.del.apply(server, args);
          case 'POST':
            return server.post.apply(server, args);
          case 'PUT':
            return server.put.apply(server, args);
        }
      }
    });
  }));
  
  /**
   * Global Configurations
   */

  server.use(express.static(app.resolve('app/public')));
  server.use(express.static(app.resolve('build/assets')));
  server.use(express.static(app.resolve('app/assets')));
  
  return server;
};

module.exports = {
  createServer: createServer
};