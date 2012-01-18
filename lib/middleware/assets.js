var parse, path, _;

path = require('path');

parse = require('url').parse;

_ = require('underscore');

module.exports = function(options) {
  var assetsPath, compilers, _ref, _ref2;
  if (options == null) options = {};
  assetsPath = (_ref = options.path) != null ? _ref : process.cwd();
  compilers = (_ref2 = options.compilers) != null ? _ref2 : [];
  return function(req, res, next) {
    var compiled, pathname;
    if ('GET' !== req.method) return next();
    pathname = parse(req.url).pathname.substring(1);
    compiled = compilers.some(function(compiler) {
      var filename;
      if (compiler.match.test(pathname)) {
        filename = path.resolve(assetsPath, pathname.replace(compiler.target, compiler.source));
        if (path.existsSync(filename)) {
          try {
            compiler.compileFile(filename, null, function(err, result) {
              if (err) {
                if (err.code && 'ENOENT' === err.code) {
                  return next();
                } else {
                  return next(err);
                }
              } else {
                res.setHeader('Content-Type', compiler.targetContentType);
                res.setHeader('Content-Length', result.length);
                return res.send(result);
              }
            });
          } catch (thrown) {
            next(thrown);
          }
          return true;
        }
      }
      return false;
    });
    if (!compiled) return next();
  };
};
