var DirectoryResolver, Resolver, fs, path, _,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

_ = require('underscore');

fs = require('fs');

path = require('path');

Resolver = require('./resolver');

module.exports = DirectoryResolver = (function(_super) {

  __extends(DirectoryResolver, _super);

  function DirectoryResolver(path) {
    DirectoryResolver.__super__.constructor.call(this, path);
  }

  DirectoryResolver.prototype._memberId = function(name) {
    var basename, dot;
    basename = path.basename(name);
    dot = basename.indexOf('.');
    if (dot >= 0) {
      return basename.slice(0, dot);
    } else {
      return basename;
    }
  };

  DirectoryResolver.prototype._load = function(event) {
    var current, previous, self;
    self = this;
    previous = Object.keys(self);
    current = fs.readdirSync(self._path).map(function(filename) {
      return path.resolve(self._path, filename);
    });
    _.without(current, previous).forEach(function(filename) {
      return self._set(filename, function() {
        return Resolver.create(filename);
      });
    });
    return _.without(previous, current).forEach(function(filename) {
      return self._unset(filename);
    });
  };

  return DirectoryResolver;

})(Resolver);
