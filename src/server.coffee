_ = require 'underscore'
express = require 'express'
router = require './router'
middleware = require './middleware'
compiler = require './compiler'
util = require 'util'
path = require 'path'
fs = require 'fs'


getHandler = (app,route) ->
  parts = route.handler.file.split('/')
  controller = app.controllers
  controller = controller?[part] for part in parts
  (req,res,next) -> 
    controller[route.handler.name] req, res, next

class Server

  constructor: (app) ->
    server = express.createServer()
    mode = process.env.NODE_ENV || 'development'
    
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
    
    server.use middleware.drive()
    
    server.use middleware.assets {
      path: app.assets._path
      compilers: [
        new compiler.Coffee
        new compiler.Less
      ]
    }

    server.use middleware.views {
      path: app.views._path
      minify: true
    }

    server.use middleware.locale {
      locales: app.conf.locales
    }


    server.use express.cookieParser()
    server.use express.bodyParser()

    #
    # Application Configurations
    #
    
    if app.conf[mode]
      app.conf[mode].configure app, server, express

    # 
    # Application Routing
    #
    _.values app.routes
    server.use middleware.route app.router

    #
    # Global Configurations
    #
    server.use express.static app.assets._path, { maxAge: 60*1000 }

    @app = app
    @server = server
    @mode = mode
  
  listen: (port, addr='localhost') ->
    console.info "Listening on #{addr}:#{port}"
    @server.listen port, addr
    @


module.exports = Server