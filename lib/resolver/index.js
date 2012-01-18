var Resolver, fs, ignore, path, _,
  __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require('underscore');

fs = require('fs');

path = require('path');

ignore = ['.git', 'node_modules'];

module.exports = Resolver = (function() {

  function Resolver(path) {
    Object.defineProperty(this, 'path', {
      value: path
    });
    Object.defineProperty(this, 'entries', {
      value: {}
    });
    Object.defineProperty(this, 'destroyed', {
      value: false,
      writable: true
    });
    this.load();
    this.watchPath();
  }

  Resolver.prototype.memberId = function(name) {
    return name;
  };

  Resolver.prototype.entryId = function(name) {
    return name;
  };

  Resolver.prototype.watchPath = function() {
    var callback;
    callback = this.load.bind(this);
    return fs.watch(this.path, callback);
  };

  Resolver.prototype.unwatchPath = function() {
    return fs.unwatchFile(this.path);
  };

  Resolver.prototype.set = function(filename, lazyValue) {
    var FunctionResolver, entryId, memberId, self;
    self = this;
    FunctionResolver = require('./function');
    entryId = self.entryId(filename);
    memberId = self.memberId(filename);
    self.entries[entryId] = void 0;
    return Object.defineProperty(self, memberId, {
      get: function() {
        var _base;
        if ((_base = self.entries)[entryId] == null) _base[entryId] = lazyValue();
        if (self.entries[entryId] instanceof FunctionResolver) {
          return self.entries[entryId].apply;
        } else {
          return self.entries[entryId];
        }
      },
      configurable: true,
      enumerable: true
    });
  };

  Resolver.prototype.unset = function(filename) {
    var entryId, memberId, self;
    self = this;
    entryId = self.entryId(filename);
    memberId = self.memberId(filename);
    if (self.entries[memberId] != null) {
      self.entries[memberId] = void 0;
      delete self.entries[memberId];
      return delete self[entryId];
    }
  };

  Resolver.prototype.destroy = function() {
    var self;
    self = this;
    self.destroyed = true;
    self.unwatchPath();
    _.each(self.entries, function(entry, entryId) {
      if (entry.destroy != null) entry.destroy();
      self.entries[entryId] = void 0;
      return delete self.entries[entryId];
    });
    return _.each(self, function(member, memberId) {
      return delete self[memberId];
    });
  };

  Resolver.prototype.contains = function(name) {
    return this.entries[name] != null;
  };

  Resolver.prototype.load = function(event) {};

  return Resolver;

})();

module.exports.resolve = function(filepath) {
  var BlissResolver, DirectoryResolver, FileResolver, ScriptResolver, basename, dot, extname, filename, stat;
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
      default:
        FileResolver = require('./file');
        return new FileResolver(filepath);
    }
  }
};
