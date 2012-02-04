var Compiler, fs, path, _;

_ = require('underscore');

fs = require('fs');

path = require('path');

module.exports = Compiler = (function() {

  function Compiler(source, target, targetContentType, options) {
    var _ref;
    this.source = source;
    this.target = target;
    this.targetContentType = targetContentType;
    this.options = options;
    this.options = _.defaults({}, (_ref = this.options) != null ? _ref : {}, {
      cacheEnabled: false
    });
    this.match = new RegExp(this.target + '$');
    this.cache = {};
  }

  Compiler.prototype.compileFile = function(filename, options, callback) {
    var entry, self, _compile, _ref;
    self = this;
    options = _.defaults({}, options != null ? options : {}, (_ref = this.options) != null ? _ref : {}, {
      paths: [path.dirname(filename)],
      filename: filename
    });
    _compile = function(filename) {
      return fs.readFile(filename, 'utf8', function(err, source) {
        try {
          return self.compile(source, options, function(err, result) {
            if (!err && result && options.cacheEnabled) {
              self.cache[filename] = {
                filename: filename,
                mtime: Date.now(),
                content: result
              };
            }
            return callback(err, result);
          });
        } catch (thrown) {
          return callback(thrown);
        }
      });
    };
    entry = self.cache[filename];
    if (options.cacheEnabled && entry) {
      return fs.stat(filename, function(err, stat) {
        if (err) {
          return callback(err);
        } else {
          if (stat.mtime > entry.mtime) {
            return _compile(filename);
          } else {
            return callback(void 0, entry.content);
          }
        }
      });
    } else {
      return _compile(filename);
    }
  };

  Compiler.prototype.compile = void 0;

  return Compiler;

})();
