_ = require 'underscore'
fs = require 'fs'
path = require 'path'
require 'js-yaml'

ignore = ['.git','node_modules']

emptyFn = () ->

module.exports = class Resolver

  constructor: (path) ->
    Object.defineProperty @, '_path', value: path
    Object.defineProperty @, '_entries', value: {}
    Object.defineProperty @, '_destroyed', {
      value: false
      writable: true
    }
    @_load()
    @_watchPath()

  _memberId: (name) -> name
  
  _entryId: (name) -> name
  
  _watchPath: () ->
    callback = @_load.bind(@)
    fs.watch @_path, callback

  _unwatchPath: () ->
    fs.unwatchFile @_path
  
  _set: (filename,lazyValue) ->
    self = @
    FunctionResolver = require './function'
    entryId = self._entryId filename
    memberId = self._memberId filename
    self._entries[entryId] = undefined
    Object.defineProperty self, memberId, {
      get: -> 
        self._entries[entryId] ?= lazyValue()
        if self._entries[entryId] instanceof FunctionResolver
          self._entries[entryId].apply
        else
          self._entries[entryId]
      configurable: true
      enumerable: true
    }
  
  _unset: (filename) ->
    self = @
    entryId = self._entryId filename
    memberId = self._memberId filename
    if self._entries[memberId]?
      self._entries[memberId] = undefined
      delete self._entries[memberId]
      delete self[entryId]

  _destroy: () ->
    self = @
    self._destroyed = true
    self._unwatchPath()
    _.each self._entries, (entry,entryId) ->
      if entry._destroy?
        entry._destroy()
      self._entries[entryId] = undefined
      delete self._entries[entryId]
    _.each self, (member,memberId) ->
      delete self[memberId]
  
  _contains: (name) -> @_entries[name]?

  _load: (event) -> 



module.exports.create = (filepath) ->

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
      when '.coffee'
        ScriptResolver = require('./script')
        return new ScriptResolver filepath
      when '.yml'
        YAMLResolver = require('./yaml')
        return new YAMLResolver filepath
      else
        FileResolver = require('./file')
        return new FileResolver filepath