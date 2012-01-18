var Bliss, path,
  __slice = Array.prototype.slice;

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
    ext: '.js.html'
  });
  viewsPath = (_ref = options.path) != null ? _ref : process.cwd();
  ext = (_ref2 = options.ext) != null ? _ref2 : '.js.html';
  return function(req, res, next) {
    res.render = function() {
      var args, filename, filepath, output, template;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (args.length > 0) {
        filename = args.shift();
        filepath = path.resolve(viewsPath, filename + ext);
        template = bliss.compileFile(filepath, {});
        output = template.apply(null, args);
        return res.send(output);
      } else {
        return next("insufficient arguments for render");
      }
    };
    return next();
  };
};
