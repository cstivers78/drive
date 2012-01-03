const Class = require('kick').Class;
const Compiler = require('./compiler').Compiler;
const coffeeScript = require('coffee-script');

const Coffee = Class([Compiler],{
  
  source: '.coffee',
  target: '.js',

  targetContentType: 'application/javascript',

  compile: function(source,options,callback) {
    options = _.defaults({},options||{},this.options||{});
    try {
      callback(undefined,coffeeScript.compile(source)); 
    }
    catch (thrown) {
      callback(thrown);
    }
  }

});

module.exports = function(options) {
  return new Coffee(options);
};
module.exports.Coffee = Coffee;