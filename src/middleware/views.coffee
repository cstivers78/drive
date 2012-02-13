_ = require 'underscore'
path = require 'path'
Bliss = require 'bliss'

module.exports = (options) ->
  options ?= {}

  bliss = new Bliss {
    minify: true,
    context: {
      _: require 'underscore'
    },
    cacheEnabled: true,
    ext: '.js.html'
  }

  viewsPath = options.path ? process.cwd();
  ext = options.ext ? '.js.html';

  return (req, res, next) ->
    res.render = (view, args...) ->
      try
        template = 
          if view._path?
            bliss.compileFile view._path
          else if _.isFunction(view)
            view
          else
            bliss.compileFile path.resolve(viewsPath,view)
        res.send template args...
      catch thrown
        next thrown
    next()