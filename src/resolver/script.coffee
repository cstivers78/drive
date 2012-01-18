_ = require 'underscore'
fs = require 'fs'
path = require 'path'
Resolver = require './'

module.exports = class ScriptResolver extends Resolver

  constructor: (path) -> super path
  
  load: (event) ->
    self = @
    
    if not path.existsSync self.path
      self.destroy()
    else
      require.cache[self.path] = undefined
      imports = require self.path

      previous = Object.keys self
      current = Object.keys imports

      # current - previous = added
      current.forEach (member) ->
        self.set member, -> imports[member]
      
      # previous - current = removed
      _.without(previous,current).forEach (member) ->
        self.unset member
  