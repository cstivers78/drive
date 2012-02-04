var FunctionResolver, Resolver,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Resolver = require('./resolver');

module.exports = FunctionResolver = (function(_super) {

  __extends(FunctionResolver, _super);

  function FunctionResolver(path) {
    FunctionResolver.__super__.constructor.call(this, path);
  }

  return FunctionResolver;

})(Resolver);
