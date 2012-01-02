const fs = require('../util/fs');
const path = require('path');
const Renderer = require('bliss').renderer.Renderer;


/**
 * Setup render.
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

  const renderer = new Renderer();
  const views = options.views || process.cwd();
  const ext = options.ext || '.js.html';

  return function(req, res, next) {

    res.render = function() {

      if ( arguments.length > 0 ) {
        const args = _.map(arguments,_.identity);
        const filename = args[0];
        const dirname = path.dirname(filename);
        const extname = path.extname(filename);
        const basename = path.basename(filename,extname);
        args[0] = path.resolve(views,dirname,basename+ext);
        res.send( renderer.render.apply(renderer,args) );
      }
      else {
        next("insufficient arguments for render")
      }
    };

    next();
  };
};
