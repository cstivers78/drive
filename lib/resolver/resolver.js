var Resolver, emptyFn, fs, ignore, path, _,
  __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require('underscore');

fs = require('fs');

path = require('path');

require('js-yaml');

ignore = ['.git', 'node_modules'];

emptyFn = function() {};

module.exports = Resolver = (function() {

  function Resolver(path) {
    Object.defineProperty(this, '_path', {
      value: path
    });
    Object.defineProperty(this, '_entries', {
      value: {}
    });
    Object.defineProperty(this, '_destroyed', {
      value: false,
      writable: true
    });
    this._load();
    this._watchPath();
  }

  Resolver.prototype._memberId = function(name) {
    return name;
  };

  Resolver.prototype._entryId = function(name) {
    return name;
  };

  Resolver.prototype._watchPath = function() {
    var callback;
    callback = this._load.bind(this);
    return fs.watch(this._path, callback);
  };

  Resolver.prototype._unwatchPath = function() {
    return fs.unwatchFile(this._path);
  };

  Resolver.prototype._set = function(filename, lazyValue) {
    var FunctionResolver, entryId, memberId, self;
    self = this;
    FunctionResolver = require('./function');
    entryId = self._entryId(filename);
    memberId = self._memberId(filename);
    self._entries[entryId] = void 0;
    return Object.defineProperty(self, memberId, {
      get: function() {
        var _base;
        if ((_base = self._entries)[entryId] == null) _base[entryId] = lazyValue();
        if (self._entries[entryId] instanceof FunctionResolver) {
          return self._entries[entryId].apply;
        } else {
          return self._entries[entryId];
        }
      },
      configurable: true,
      enumerable: true
    });
  };

  Resolver.prototype._unset = function(filename) {
    var entryId, memberId, self;
    self = this;
    entryId = self._entryId(filename);
    memberId = self._memberId(filename);
    if (self._entries[memberId] != null) {
      self._entries[memberId] = void 0;
      delete self._entries[memberId];
      return delete self[entryId];
    }
  };

  Resolver.prototype._destroy = function() {
    var self;
    self = this;
    self._destroyed = true;
    self._unwatchPath();
    _.each(self._entries, function(entry, entryId) {
      if (entry._destroy != null) entry._destroy();
      self._entries[entryId] = void 0;
      return delete self._entries[entryId];
    });
    return _.each(self, function(member, memberId) {
      return delete self[memberId];
    });
  };

  Resolver.prototype._contains = function(name) {
    return this._entries[name] != null;
  };

  Resolver.prototype._load = function(event) {};

  return Resolver;

})();

module.exports.create = function(filepath) {
  var BlissResolver, DirectoryResolver, FileResolver, ScriptResolver, YAMLResolver, basename, dot, extname, filename, stat;
  stat = fs.statSync(filepath);
  filename = path.basename(filepath);
  dot = filename.indexOf('.');
  if (__indexOf.call(ignore, filename) >= 0) return;
  if (stat.isDirectory()) {
    DirectoryResolver = require('./directory');
    return new DirectoryResolver(filepath);
  } else {
    filename = path.basename(filepath);
    dot = filename.indexOf('.');
    basename = dot > 0 ? filename.slice(0, dot) : filename;
    extname = dot > 0 ? filename.slice(dot) : '';
    switch (extname) {
      case '.js.html':
        BlissResolver = require('./bliss');
        return new BlissResolver(filepath);
      case '.js':
        ScriptResolver = require('./script');
        return new ScriptResolver(filepath);
      case '.coffee':
        ScriptResolver = require('./script');
        return new ScriptResolver(filepath);
      case '.yml':
        YAMLResolver = require('./yaml');
        return new YAMLResolver(filepath);
      default:
        FileResolver = require('./file');
        return new FileResolver(filepath);
    }
  }
};
