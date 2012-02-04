var FileResolver, Resolver,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Resolver = require('./resolver');

module.exports = FileResolver = (function(_super) {

  __extends(FileResolver, _super);

  function FileResolver(path) {
    FileResolver.__super__.constructor.call(this, path);
  }

  return FileResolver;

})(Resolver);
