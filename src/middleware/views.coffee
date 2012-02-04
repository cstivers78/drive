path = require 'path'
Bliss = require 'bliss'

module.exports = (options) ->
  options ?= {}

  bliss = new Bliss {
    minify: true,
    context: {
      _: require 'underscore'
    },
    ext: '.js.html'
  }

  viewsPath = options.path ? process.cwd();
  ext = options.ext ? '.js.html';

  return (req, res, next) ->
    res.render = (args...) ->
      if args.length > 0 
        filename = args.shift()
        filepath = path.resolve viewsPath, filename
        template = bliss.compileFile filepath, {}
        output = template.apply null, args
        res.send output
      else
        next "insufficient arguments for render"
    next()