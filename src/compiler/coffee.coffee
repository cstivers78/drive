_ = require 'underscore'
coffeeScript = require 'coffee-script'
Compiler = require './compiler'

module.exports = class Coffee extends Compiler

  source = '.coffee'
  target = '.js'
  contentType = 'application/javascript'

  constructor: (options) -> super source, target, contentType, options

  compile: (source,options,callback) ->
    options = _.defaults {}, options ? {}, @options ? {}
    try
      callback undefined, coffeeScript.compile(source)
    catch error
      callback error
