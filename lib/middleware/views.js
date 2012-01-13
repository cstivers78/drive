const fs = require('../util/fs');
const path = require('path');
const Bliss = require('bliss');
const minifier = require('html-minifier');


/**
 * Views Middleware.
 *
 * Augments response with a render() function for Bliss.
 *
 * Options:
 *
 *   - `views`     Source directory, defaults to **CWD**.
 *
 * @param {Object} options
 * @api public
 */

module.exports = function(options){
  options = options || {};

  const bliss = new Bliss({
    minify: options.minify === true,
    options: {
      _:require('underscore')
    },
    ext: '.js.html'
  });
  const views = options.views || process.cwd();
  const ext = options.ext || '.js.html';

  return function(req, res, next) {

    res.render = function() {

      if ( arguments.length > 0 ) {
        const args = _.map(arguments,_.identity);
        const filename = args.shift();
        const filepath = path.resolve(views,filename+ext);
        const template = bliss.compileFile(filepath,{});
        const output = template.apply(null,args);
        res.send( output );
      }
      else {
        next("insufficient arguments for render")
      }
    };

    next();
  };
};
