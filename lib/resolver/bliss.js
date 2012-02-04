var Bliss, BlissResolver, FunctionResolver, bliss, main, path,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

FunctionResolver = require('./function');

Bliss = require('bliss');

path = require('path');

main = require('../index');

bliss = new Bliss({
  minify: true,
  context: {
    _: require('underscore'),
    app: main.app,
    views: main.app.views
  },
  ext: '.js.html'
});

module.exports = BlissResolver = (function(_super) {

  __extends(BlissResolver, _super);

  function BlissResolver(path) {
    BlissResolver.__super__.constructor.call(this, path);
  }

  BlissResolver.prototype._load = function(event) {
    var self, template;
    self = this;
    if (!path.existsSync(self._path)) {
      return self._destroy();
    } else {
      template = bliss.compileFile(self._path);
      return self._set('apply', function() {
        return template;
      });
    }
  };

  return BlissResolver;

})(FunctionResolver);
