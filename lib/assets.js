const _ = require('underscore');
const Class = require('../define').Class
const Resolver = require('../util/resolver').Resolver
const Compiler = require('../compiler').Compiler
const path = require('path')
const fs = require('fs')

Assets = Class([Resolver],{
  
  compilers: undefined,

  init: function(basepath) {
    Resolver.prototype.init.call(this,basepath);
    this.compilers = [];
  },


});

module.exports = function(basepath) {
  return new Assets(basepath);
};
module.exports.Assets = Assets;