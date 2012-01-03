const Class = require('kick').Class;
const Compiler = require('./compiler').Compiler;
const coffeeScript = require('coffee-script');

const Coffee = Class([Compiler],{
  
  source: '.coffee',
  target: '.js',

  compileString: function(string,options,callback) {
    options = _.extend(this.options,options || {});
    try {
      callback(undefined,coffeeScript.compile(string)); 
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