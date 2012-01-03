const _ = require('underscore');
const Class = require('kick').Class;
const loader = require
const path = require('path');
const fs = require('./fs')

Resolver = Class({
  
  basepath: undefined,

  init: function(basepath) {
    this.basepath = basepath;
  },

  resolve: function(filepath) {
    const args = _.map(arguments, _.identity);
    args.unshift(this.basepath);
    return path.resolve.apply(this, args);
  },

  exists: function(filepath,callback) {
    const file = this.resolve(filepath);
    path.exists( file, function(exists) {
      if ( !exists ) {
        path.exists( file+".js", callback);
      }
      else {
        callback(exists);
      }
    });
  },


  existsSync: function(filepath) {
    const file = this.resolve(filepath);
    if ( !path.existsSync( file ) ) {
      return path.existsSync(file+".js");
    }
    else {
      return true;
    }
  },

  stat: function(filepath,callback) {
    const file = this.resolve(filepath);
    path.stat( file, function(err,stat) {
      if ( err ) {
        callback(err);
        path.stat( file+".js", callback);
      }
      else {
        path.stat( file+".js", callback);
      }
    });
  },

  relative: function(filepath) {
    return filepath.indexOf(this.basepath) == 0 ? filepath.substring(this.basepath.length+1) : filepath;
  },

  list: function() {
    return fs.readdirRec(this.basepath);
  },

  length: {
    get: function() {
      return this.list().length;
    }
  },

  read: function(filepath,callback) {
    fs.readFile(this.resolve(filepath),'utf-8',callback);
  },

  require: function(filepath) {
    return require(this.resolve(filepath));
  }

});

module.exports = function(basepath) {
  return new Resolver(basepath);
};
module.exports.Resolver = Resolver;
