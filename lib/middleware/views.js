var Bliss, path, _,
  __slice = Array.prototype.slice;

_ = require('underscore');

path = require('path');

Bliss = require('bliss');

module.exports = function(options) {
  var bliss, ext, viewsPath, _ref, _ref2;
  if (options == null) options = {};
  bliss = new Bliss({
    minify: true,
    context: {
      _: require('underscore')
    },
    cacheEnabled: true,
    ext: '.js.html'
  });
  viewsPath = (_ref = options.path) != null ? _ref : process.cwd();
  ext = (_ref2 = options.ext) != null ? _ref2 : '.js.html';
  return function(req, res, next) {
    res.render = function() {
      var args, template, view;
      view = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      try {
        template = view._path != null ? bliss.compileFile(view._path) : _.isFunction(view) ? view : bliss.compileFile(path.resolve(viewsPath, view));
        return res.send(template.apply(null, args));
      } catch (thrown) {
        return next(thrown);
      }
    };
    return next();
  };
};
