var Resolver, ScriptResolver, fs, path, _,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

_ = require('underscore');

fs = require('fs');

path = require('path');

Resolver = require('./resolver');

module.exports = ScriptResolver = (function(_super) {

  __extends(ScriptResolver, _super);

  function ScriptResolver(path) {
    ScriptResolver.__super__.constructor.call(this, path);
  }

  ScriptResolver.prototype._load = function(event) {
    var current, imports, previous, self;
    self = this;
    if (!path.existsSync(self._path)) {
      return self._destroy();
    } else {
      require.cache[self._path] = void 0;
      imports = require(self._path);
      previous = Object.keys(self);
      current = Object.keys(imports);
      current.forEach(function(member) {
        return self._set(member, function() {
          return imports[member];
        });
      });
      return _.without(previous, current).forEach(function(member) {
        return self._unset(member);
      });
    }
  };

  return ScriptResolver;

})(Resolver);
