_ = require 'underscore'
fs = require 'fs'
path = require 'path'

ignore = ['.git','node_modules']

module.exports = class Resolver

  constructor: (path) ->
    Object.defineProperty @, 'path', value: path
    Object.defineProperty @, 'entries', value: {}
    Object.defineProperty @, 'destroyed', {
      value: false
      writable: true
    }
    @load()
    @watchPath()

  memberId: (name) -> name
  
  entryId: (name) -> name
  
  watchPath: () ->
    callback = @load.bind(@)
    fs.watch @path, callback

  unwatchPath: () ->
    fs.unwatchFile @path
  
  set: (filename,lazyValue) ->
    self = @
    FunctionResolver = require './function'
    entryId = self.entryId filename
    memberId = self.memberId filename
    self.entries[entryId] = undefined
    Object.defineProperty self, memberId, {
      get: -> 
        self.entries[entryId] ?= lazyValue()
        if self.entries[entryId] instanceof FunctionResolver
          self.entries[entryId].apply
        else
          self.entries[entryId]
      configurable: true
      enumerable: true
    }
  
  unset: (filename) ->
    self = @
    entryId = self.entryId filename
    memberId = self.memberId filename
    if self.entries[memberId]?
      self.entries[memberId] = undefined
      delete self.entries[memberId]
      delete self[entryId]

  destroy: () ->
    self = @
    self.destroyed = true
    self.unwatchPath()
    _.each self.entries, (entry,entryId) ->
      if entry.destroy?
        entry.destroy()
      self.entries[entryId] = undefined
      delete self.entries[entryId]
    _.each self, (member,memberId) ->
      delete self[memberId]
  
  contains: (name) -> @entries[name]?

  load: (event) -> 



module.exports.resolve = (filepath) ->

  stat = fs.statSync filepath
  filename = path.basename filepath
  dot = filename.indexOf '.'
  
  if filename in ignore
    return
  
  if stat.isDirectory()
    DirectoryResolver = require('./directory')
    new DirectoryResolver filepath
  else

    filename = path.basename filepath
    dot = filename.indexOf '.'
    basename = if dot > 0 then filename[...dot] else filename
    extname = if dot > 0 then filename[dot..] else ''

    switch extname
      when '.js.html'
        BlissResolver = require('./bliss')
        return new BlissResolver filepath
      when '.js'
        ScriptResolver = require('./script')
        return new ScriptResolver filepath
      else
        FileResolver = require('./file')
        return new FileResolver filepath