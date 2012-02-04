_ = require 'underscore'
fs = require 'fs'
path = require 'path'
Resolver = require './resolver'

module.exports = class DirectoryResolver extends Resolver

  constructor: (path) -> super path
  
  _memberId: (name) ->
    basename = path.basename name
    dot = basename.indexOf('.')
    if dot >= 0 then basename[...dot] else basename

  _load: (event) ->
    self = @
    
    previous = Object.keys(self)
    current = fs.readdirSync(self._path).map (filename) -> path.resolve self._path, filename

    # current - previous = added
    _.without(current,previous).forEach (filename) ->
      self._set filename, -> Resolver.create filename
    
    # previous - current = removed
    _.without(previous,current).forEach (filename) ->
      self._unset filename

