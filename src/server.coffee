_ = require 'underscore'
express = require 'express'
compiler = require './compiler'
routes = require './routes'
path = require 'path'
fs = require 'fs'


getHandler = (app,route) ->
  parts = route.handler.file.split('/')
  controller = app.controllers
  controller = controller?[part] for part in parts
  (req,res,next) -> 
    controller[route.handler.name] req, res, next

module.exports = class Server

  constructor: (app) ->
    server = express.createServer();
    mode = process.env.NODE_ENV || 'development';
    
    #
    # Global Configurations
    #

    server.use express.errorHandler {
      stack: true
      message: true
      dump: true
    }

    server.use express.logger()

    if mode == 'development'
      server.use express.profiler()
      server.use express.responseTime()
    
    server.use require('./middleware/drive')()
    
    server.use require('./middleware/assets') {
      path: app.assets.path
      compilers: [
        new (require('./compiler/coffee'))
        new (require('./compiler/less'))
      ]
    }

    server.use require('./middleware/views') {
      path: app.views.path
      minify: true
    }

    server.use express.bodyParser()

    #
    # Application Configurations
    #

    # if app.configs.existsSync mode
      # app.configs.require(mode).configure app, server, express

    # 
    # Application Routing
    #

    routes(app.conf.routes.path).forEach (route) ->
      handler = getHandler(app,route)
      if route.method && route.uri && handler?
        switch route.method
          when 'GET'    then server.get.call server, route.uri, handler
          when 'DELETE' then server.del.call server, route.uri, handler
          when 'POST'   then server.post.call server, route.uri, handler
          when 'PUT'    then server.put.call server, route.uri, handler

    #
    # Global Configurations
    #
    server.use express.static app.public.path, { maxAge: 60*1000 }
    server.use express.static app.assets.path, { maxAge: 60*1000 }

    @app = app
    @server = server
    @mode = mode
    
  listen: (port, addr) ->
    @server.listen port, addr
    @