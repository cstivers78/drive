const fs = require('../util/fs');
const path = require('path');
const parse = require('url').parse;
const _ = require('underscore');


/**
 * Setup compile.
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

  const source = options.source || process.cwd();
  const target = options.target || source;
  const compilers = options.compilers || [];

  return function(req, res, next) {
    if ('GET' != req.method) return next();
    var pathname = parse(req.url).pathname.substring(1);

    const compiled = compilers.some(function(compiler){

      if ( compiler.match.test(pathname) ) {

        const sourceFile = path.resolve(source, pathname.replace(compiler.target, compiler.source));
        const targetFile = path.resolve(target, pathname);

        // Compare mtimes
        fs.stat(sourceFile, function(err, sourceStat){
          if (err) {
            if ('ENOENT' == err.code) {
              next();
            } else {
              next(err);
            }
          }
          else {
            fs.stat(targetFile, function(err, targetStat){
              if (err) {
                // Oh snap! it does not exist, compile it
                if ('ENOENT' == err.code) {
                  compile();
                } else {
                  next(err);
                }
              } else {
                // Source has changed, compile it
                if (sourceStat.mtime > targetStat.mtime) {
                  compile();
                } else {
                  // Defer file serving
                  next();
                }
              }
            });
          }
        });

        // Compile to the destination
        function compile() {
          compiler.compileFile(sourceFile,{},function(err,string){
            if ( err ) {
              next(err);
            }
            else {
              fs.mkdirRec(path.dirname(targetFile),function(err){
                if ( err ) {
                  next(err);
                }
                else {
                  fs.writeFile(targetFile,string,'utf8',function(err){
                    next(err);
                  }); 
                }
              });
            }
          });
        }

        return true;
      }
      return false;
    });

    if ( !compiled ) {
      next();
    }
  };
};
