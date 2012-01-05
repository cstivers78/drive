const fs = require('../util/fs');
const path = require('path');
const Bliss = require('bliss').Bliss;


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
    imports: {
      _:require('underscore')
    }
  });
  const views = options.views || process.cwd();
  const ext = options.ext || '.js.html';

  return function(req, res, next) {

    res.render = function() {

      if ( arguments.length > 0 ) {
        const args = _.map(arguments,_.identity);
        const filename = args.shift();
        const dirname = path.dirname(filename);
        const extname = path.extname(filename);
        const basename = path.basename(filename,extname);
        const filepath = path.resolve(views,dirname,basename+ext);
        const template = bliss.compile(filepath,{})
        console.log(template.toCode());
        res.send( template.apply(null,args) );
      }
      else {
        next("insufficient arguments for render")
      }
    };

    next();
  };
};
