FunctionResolver = require './function'
Bliss = require 'bliss'
path = require 'path'
main = require '../index'

bliss = new Bliss({
  minify: true
  context:
    _: require('underscore')
    app: main.app
    views: main.app.views
  ext: '.js.html'
});

module.exports = class BlissResolver extends FunctionResolver

  constructor: (path) -> super path
  
  _load: (event) ->
    self = @
    if not path.existsSync self._path
      self._destroy()
    else
      template = bliss.compileFile self._path
      self._set 'apply', -> template