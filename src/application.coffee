_ = require 'underscore'
path = require 'path'
Resolver = require('./resolver').Resolver
Router = require('./router').Router
Server = require './server'

cache = {};

class Application

  constructor: (@module) ->
    self = @
    @path = path.dirname @module.filename
    @router = router = new Router()
    @app = app = Resolver.create path.resolve @path, 'app'
    @conf = conf = Resolver.create path.resolve @path, 'conf'
    Object.defineProperty @, 'assets', get: -> app.assets
    Object.defineProperty @, 'models', get: -> app.models
    Object.defineProperty @, 'views', get: -> app.views
    Object.defineProperty @, 'routes', get: -> app.routes
  
  listen: (port,address) ->
    try
      server = new Server(@)
      server.listen port, address
    catch thrown
      console.error thrown
  
  info: () ->
    console.log "application :=", this.basepath
    console.log "     routes :=", this.routes.length
    console.log "     assets :=", this.assets.length
    console.log "     models :=", this.models.length
    console.log "      views :=", this.views.length
    console.log "controllers :=", this.controllers.list().length

module.exports = Application
module.exports.application = (module) ->
  module ?= require.main
  cache[module.filename] ?= new Application(module)