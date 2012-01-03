const _ = require('underscore');
const path = require('path');
const Class = require('kick').Class;
const registry = require('./util').registry;
const loader = require('./util').loader;
const resolver = require('./util').resolver;

const cache = {};

const Application = Class([resolver.Resolver],{

  configs: undefined,
  assets: undefined,
  controllers: undefined,
  models: undefined,
  routes: undefined,
  views: undefined,
  
  init: function(module) {
    this.basepath = path.dirname(module.filename)
    this.configs = resolver(this.resolve('conf'));
    this.assets = resolver(this.resolve('app/assets'));
    this.models = resolver(this.resolve('app/models'));
    this.views = resolver(this.resolve('app/views'));
    this.controllers = resolver(this.resolve('app/controllers'));
    this.routes = this.require('./conf/routes').routes;
  },
  
  configure: function() {
    this.configs.push(_.map(arguments, _.identity));
  },
  
  listen: function(port,address) {
    return require('./server').createServer(this).listen(port,address);
  },
  
  info: function() {
    console.log("application :=", this.basepath);
    console.log("     routes :=", this.routes.length);
    console.log("     assets :=", this.assets.length);
    console.log("     models :=", this.models.length);
    console.log("      views :=", this.views.length);
    console.log("controllers :=", this.controllers.list().length);
  }
});

module.exports = function(module) {
  module = module || require.main;
  if ( !cache[module.filename] )
    return cache[module.filename] = new Application(module);
  return cache[module.filename];
};

module.exports.Application = Application;