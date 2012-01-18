_ = require 'underscore'
path = require 'path'
Resolver = require './resolver'
Server = require './server'

cache = {};

module.exports = class Application

  constructor: (@module) ->
    self = @
    @path = path.dirname @module.filename
    @app = app = Resolver.resolve path.resolve @path, 'app'
    @conf = conf = Resolver.resolve path.resolve @path, 'conf'
    Object.defineProperty @, 'assets', get: -> app.assets
    Object.defineProperty @, 'public', get: -> app.public
    Object.defineProperty @, 'models', get: -> app.models
    Object.defineProperty @, 'views', get: -> app.views
    Object.defineProperty @, 'controllers', get: -> app.controllers
  
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

module.exports.application = (module) ->
  module ?= require.main
  cache[module.filename] ?= new Application(module)