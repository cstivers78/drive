const Class = require('../define').Class;
const fs = require('fs');
const path = require('path');

const Compiler = Class({
  
  target: undefined,
  source: undefined,
  options: undefined,
  match: undefined,

  init: function(options) {
    this.options = options || this.options || {};
    this.match = new RegExp(this.target+'$');
  },

  compileFile: function(filename,options,callback) {
    const self = this;
    fs.readFile(filename,'utf8',function(err,string){
      if ( err ) {
        callback(err);
      }
      else {
        self.compileString(string,_.extend(options,{
          paths: [path.dirname(filename)],
          filename: filename
        }),callback)
      }
    });
  },

  compileString: function(string,options,callback) {
  }

});

module.exports.Compiler = Compiler;