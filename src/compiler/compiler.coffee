_ = require 'underscore'
fs = require 'fs'
path = require 'path'

module.exports = class Compiler

  constructor: (@source, @target, @targetContentType, @options) ->
    @options = _.defaults {}, @options ? {}, {
      cacheEnabled: false
    }
    @match = new RegExp @target + '$'
    @cache = {}

  compileFile: (filename,options,callback) ->

    self = @
    options = _.defaults {}, options ? {}, @options ? {}, {
      paths: [path.dirname(filename)],
      filename: filename
    }

    _compile = (filename) ->
      fs.readFile filename, 'utf8', (err,source) ->
        try
          self.compile source, options, (err,result) ->
            if !err && result && options.cacheEnabled
              self.cache[filename] = {
                filename: filename
                mtime: Date.now()
                content: result
              }
            callback err, result
        catch thrown
          callback thrown
    
    entry = self.cache[filename]

    if options.cacheEnabled && entry
      fs.stat filename, (err, stat) ->
        if err
          callback err
        else
          if stat.mtime > entry.mtime
            _compile filename
          else
            callback undefined, entry.content
    else
      _compile filename

  compile: undefined
