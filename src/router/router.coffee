_ = require 'underscore'
Path = require './path'
Route = require './route'

class Router
  constructor: ->
    @root = new Node
    @routes = []
  
  findPattern = (pattern) -> (node) -> node.pattern? && node.pattern == pattern
  findMatch = (segment) -> (node) -> node.pattern? && node.pattern.exec(segment) != null

  match = (current,segment) ->
    if current? and current.value == '*'
      current
    else if current? and segment?
      if current.values[segment]?
        current.values[segment]
      else
        node = _.find current.patterns, findMatch(segment)
        node ? current.fallback()
    else
      undefined
  
  find = (current,segment) ->
    if current? and segment?
      if segment.name? and segment.pattern?
        _.find current.patterns, findPattern(segment.pattern)
      else
        current.values[segment] ? current.catchcall
    else
      undefined
  
  findAndCreate = (current,segment) ->
    if current? and current?.value == '*'
      current
    else if segment? and segment.name? and segment.pattern?
      node = new PatternNode(current,segment.pattern)
      current.patterns[node] = node
      node
    else if segment == '*'
      node = new ValueNode(current,segment)
      current.catchall = node
      node
    else if not current.values?[segment]
      node = new ValueNode(current,segment)
      current.values[node] = node
      node
    else
      current.values[segment]
    
  add: (route) ->
    node = route.path.segments.reduce findAndCreate, @root
    if node?
      node.methods[route.method] = route
  
  remove: (route) ->
    node = route.path.segments.reduce find, @root
    if node?
      delete node.methods[route.method]
  
  lookup: (path,method) ->
    console.log 'lookup >>'
    if path? and method?
      if path not instanceof Path
        path = new Path(path)
      node = path.segments.reduce find, @root
      if node
        node.methods[method]
      else
        undefined
    else
      undefined
  
  match: (path,method) ->
    Path.segment(path).reduce match, @root

  register1 = (self, method) -> (path, middleware...) -> self.register method, path, middleware...
  register2 = (self, method, path) -> (middleware...) -> self.register method, path, middleware...
  
  register: (method, path,middleware...) ->
    if method? and path? and middleware?
      @add new Route method, path, middleware...
    else if method? and path?
      register2 @, method, path
    else if method?
      register1 @, method
    else
      register.bind(@)

class Node
  constructor: (@parent) ->
    @methods = {}
    @values = {}
    @patterns = {}
    @catchall = undefined
  method: (m) ->
    @methods[m]
  fallback: ->
    if @catchall?
      @catchall
    else if @parent
      @parent.fallback()
    else
      undefined

class ValueNode extends Node
  constructor: (parent,@value) -> super(parent)
  toString: -> @value

class PatternNode extends Node
  constructor: (parent,@pattern) -> super(parent)
  toString: -> @pattern.toString()


module.exports = Router