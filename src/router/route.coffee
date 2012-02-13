_ = require 'underscore'
Path = require './path'
parseUrl = require('url').parse

class Route
  
  constructor: (@method, @path, @middleware...) ->
    if @path not instanceof Path
      @path = new Path(@path)
  
  apply: (req,res,next) ->

    req.params = {}
    reqSegments = Path.segment(parseUrl(req.url).pathname)
    for parameter in @path.parameters
      req.params[parameter.name] = reqSegments[parameter.pos]
    
    middleware = _.flatten @middleware

    callbacks = (err) ->
      callback = middleware.shift()
      if err && callback
        if callback.length >= 4 
          callback err, req, res, callbacks
        else
          callbacks(err);
      else if callback
        callback req, res, callbacks
      else
        next err

    callbacks()

module.exports = Route