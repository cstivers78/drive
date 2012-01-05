const _ = require('underscore');
const express = require('express');
const middleware = require('./middleware');
const path = require('path');


const routeToArgs = function(app,route) {
  const args = [];

  args.push(route.uri);

  const controller = app.controllers.require(route.handler.file);

  if ( route.handler.name && controller[route.handler.name] ) {
    args.push(controller[route.handler.name]);
  }
  else if ( _.isFunction(controller) ) {
    args.push(controller);
  }
  else if ( route.handler.file && route.handler.name ) {
    throw ['Controller not found: ',route.handler.file,'.',route.handler.name,' at ',route.debug.filename,':',route.debug.lineno].join('');
  }
  else if ( route.handler.file ) {
    throw ['Controller not found: ',route.handler.file,' at ',route.debug.filename,':',route.debug.lineno].join('');
  }
  else {
    throw ['Invalid entry for controller at ',route.debug.filename,':',route.debug.lineno].join('');
  }

  return args;
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
  server.use(express.errorHandler());
  server.use(express.logger());

  if ( mode == 'development' ) {
    server.use(express.profiler());
    server.use(express.responseTime());      
  }
  
  server.use(middleware.drive());
  server.use(middleware.assets({
    assets: app.assets.basepath,
    compilers: [
      require('./compiler').coffee(), 
      require('./compiler').less()
    ]
  }));
  server.use(middleware.views({
    views: app.views.basepath,
    minify: false
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
  
  // server.use(express.router(function(server){
    app.routes.forEach(function(route) {
      if ( route.method && route.uri && route.handler ) {
        const args = routeToArgs(app,route);
        switch (route.method) {
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
  // }));
  
  /**
   * Global Configurations
   */

  server.use(express.static(app.resolve('app/public'), { maxAge: 60*1000 }));
  server.use(express.static(app.resolve('app/assets'), { maxAge: 60*1000 }));
  
  return server;
};

module.exports = {
  createServer: createServer
};