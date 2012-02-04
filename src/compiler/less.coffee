_ = require 'underscore'
less = require 'less'
Compiler = require './compiler'

module.exports = class Coffee extends Compiler

  source = '.less'
  target = '.css'
  contentType = 'text/css'

  constructor: (options) -> super source, target, contentType, options

  compile: (source,options,callback) ->
    options = _.defaults {}, options ? {}, @options ? {}
    try
      parser = new(less.Parser)(options);
      parser.parse source, (err, tree) ->
        if err
          callback err
        else
          try
            css = tree.toCSS()
            callback undefined, css
          catch thrown
            console.log '[error]','error compiling css from '+thrown.filename+'. Cause: '+thrown.message
            callback thrown
    catch thrown
      callback thrown
