var Application, Resolver, Router, Server, cache, path, _;

_ = require('underscore');

path = require('path');

Resolver = require('./resolver').Resolver;

Router = require('./router').Router;

Server = require('./server');

cache = {};

Application = (function() {

  function Application(module) {
    var app, conf, router, self;
    this.module = module;
    self = this;
    this.path = path.dirname(this.module.filename);
    this.router = router = new Router();
    this.app = app = Resolver.create(path.resolve(this.path, 'app'));
    this.conf = conf = Resolver.create(path.resolve(this.path, 'conf'));
    Object.defineProperty(this, 'assets', {
      get: function() {
        return app.assets;
      }
    });
    Object.defineProperty(this, 'models', {
      get: function() {
        return app.models;
      }
    });
    Object.defineProperty(this, 'views', {
      get: function() {
        return app.views;
      }
    });
    Object.defineProperty(this, 'routes', {
      get: function() {
        return app.routes;
      }
    });
  }

  Application.prototype.listen = function(port, address) {
    var server;
    try {
      server = new Server(this);
      return server.listen(port, address);
    } catch (thrown) {
      return console.error(thrown);
    }
  };

  Application.prototype.info = function() {
    console.log("application :=", this.basepath);
    console.log("     routes :=", this.routes.length);
    console.log("     assets :=", this.assets.length);
    console.log("     models :=", this.models.length);
    console.log("      views :=", this.views.length);
    return console.log("controllers :=", this.controllers.list().length);
  };

  return Application;

})();

module.exports = Application;

module.exports.application = function(module) {
  var _name, _ref;
  if (module == null) module = require.main;
  return (_ref = cache[_name = module.filename]) != null ? _ref : cache[_name] = new Application(module);
};
