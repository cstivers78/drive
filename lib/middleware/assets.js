const fs = require('../util/fs');
const path = require('path');
const parse = require('url').parse;
const _ = require('underscore');


/**
 * Assets Middleware.
 *
 * Compile and send assets.
 *
 * Options:
 *
 *   - `source`     Source directory, defaults to **CWD**.
 *   - `target`     Target directory, defaults `source`.
 *   - `compilers`  Array of Compiler objects.
 *
 * @param {Object} options
 * @api public
 */

module.exports = function(options){
  options = options || {};

  const assets = options.assets || process.cwd();
  const compilers = options.compilers || [];

  return function(req, res, next) {
    if ('GET' != req.method) return next();
    var pathname = parse(req.url).pathname.substring(1);

    const compiled = compilers.some(function(compiler){

      if ( compiler.match.test(pathname) ) {
        const filename = path.resolve(assets, pathname.replace(compiler.target, compiler.source));
        if ( path.existsSync(filename) ) {
          compiler.compileFile(filename,null,function(err,result){
            if ( err ) {
              if ( err.code && 'ENOENT' == err.code ) {
                next();
              }
              else {
                next(err);
              }
            }
            else {
              res.setHeader('Content-Type', compiler.targetContentType);
              res.setHeader('Content-Length', result.length);
              res.send(result);
            }
          });

          return true;
        }
      }
      return false;
    });

    if ( !compiled ) {
      next();
    }
  };
};
