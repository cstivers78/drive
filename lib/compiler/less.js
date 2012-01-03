const Class = require('kick').Class;
const Compiler = require('./compiler').Compiler;
const less = require('less');

const Less = Class([Compiler],{
  
  source: '.less',
  target: '.css',

  targetContentType: 'text/css',

  compile: function(source,options,callback) {
    options = _.defaults({},options||{},this.options||{});
    try {
      const parser = new(less.Parser)(options);
      parser.parse(source, function (err, tree) {
        if (err) { 
          callback(err);
        }
        else {
          callback(undefined,tree.toCSS());
        }
      });
    }
    catch (thrown) {
      callback(thrown);
    }
  }

});

module.exports = function(options) {
  return new Less(options);
};
module.exports.Less = Less;