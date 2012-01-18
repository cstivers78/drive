_ = require 'underscore'
fs = require 'fs'
path = require 'path'
Resolver = require './'

module.exports = class DirectoryResolver extends Resolver

  constructor: (path) -> super path
  
  memberId: (name) ->
    basename = path.basename name
    dot = basename.indexOf('.')
    if dot >= 0 then basename[...dot] else basename

  load: (event) ->
    self = @
    
    previous = Object.keys(self)
    current = fs.readdirSync(self.path).map (filename) -> path.resolve self.path, filename

    # current - previous = added
    _.without(current,previous).forEach (filename) ->
      self.set filename, -> Resolver.resolve filename
    
    # previous - current = removed
    _.without(previous,current).forEach (filename) ->
      self.unset filename

