var Coffee, Compiler, coffeeScript, _,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

_ = require('underscore');

coffeeScript = require('coffee-script');

Compiler = require('./compiler');

module.exports = Coffee = (function(_super) {
  var contentType, source, target;

  __extends(Coffee, _super);

  source = '.coffee';

  target = '.js';

  contentType = 'application/javascript';

  function Coffee(options) {
    Coffee.__super__.constructor.call(this, source, target, contentType, options);
  }

  Coffee.prototype.compile = function(source, options, callback) {
    var _ref;
    options = _.defaults({}, options != null ? options : {}, (_ref = this.options) != null ? _ref : {});
    try {
      return callback(void 0, coffeeScript.compile(source));
    } catch (error) {
      return callback(error);
    }
  };

  return Coffee;

})(Compiler);
