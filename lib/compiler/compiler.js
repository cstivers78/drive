const _ = require('underscore');
const Class = require('kick').Class;
const fs = require('fs');
const path = require('path');

const Compiler = Class({
  
  target: undefined,
  targetContentType: undefined,
  source: undefined,
  options: undefined,
  match: undefined,
  cache: undefined,

  init: function(options) {
    this.options = _.defaults({},options||{},{
      cacheEnabled: true
    });
    this.match = new RegExp(this.target+'$');
    this.cache = {};
  },

  compileFile: function(filename,options,callback) {

    options = _.defaults({},options||{},this.options,{
      paths: [path.dirname(filename)],
      filename: filename
    });

    const self = this;

    const _compile = function(filename) {
      fs.readFile(filename,'utf8',function(err,source){
        self.compile(source,options,function(err,result){
          if ( !err && result && options.cacheEnabled ) {
            self.cache[filename] = {
              filename: filename,
              mtime: Date.now(),
              content: result
            };
          }
          callback(err,result);
        });
      });
    };

    const entry = self.cache[filename];
    if ( options.cacheEnabled && entry ) {
      fs.stat(filename, function(err, stat){
        if (err) {
          callback(err);
        }
        else {
          if ( stat.mtime > entry.mtime ) {
            _compile(filename);
          }
          else {
            callback(undefined,entry.content);
          }
        }
      });
    }
    else {
      _compile(filename);
    }
  },

  compile: undefined

});

module.exports.Compiler = Compiler;