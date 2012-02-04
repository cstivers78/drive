var Coffee, Compiler, less, _,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

_ = require('underscore');

less = require('less');

Compiler = require('./compiler');

module.exports = Coffee = (function(_super) {
  var contentType, source, target;

  __extends(Coffee, _super);

  source = '.less';

  target = '.css';

  contentType = 'text/css';

  function Coffee(options) {
    Coffee.__super__.constructor.call(this, source, target, contentType, options);
  }

  Coffee.prototype.compile = function(source, options, callback) {
    var parser, _ref;
    options = _.defaults({}, options != null ? options : {}, (_ref = this.options) != null ? _ref : {});
    try {
      parser = new less.Parser(options);
      return parser.parse(source, function(err, tree) {
        var css;
        if (err) {
          return callback(err);
        } else {
          try {
            css = tree.toCSS();
            return callback(void 0, css);
          } catch (thrown) {
            console.log('[error]', 'error compiling css from ' + thrown.filename + '. Cause: ' + thrown.message);
            return callback(thrown);
          }
        }
      });
    } catch (thrown) {
      return callback(thrown);
    }
  };

  return Coffee;

})(Compiler);
