var Path, Route, parseUrl, _,
  __slice = Array.prototype.slice;

_ = require('underscore');

Path = require('./path');

parseUrl = require('url').parse;

Route = (function() {

  function Route() {
    var method, middleware, path;
    method = arguments[0], path = arguments[1], middleware = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    this.method = method;
    this.path = path;
    this.middleware = middleware;
    if (!(this.path instanceof Path)) this.path = new Path(this.path);
  }

  Route.prototype.apply = function(req, res, next) {
    var callbacks, middleware, parameter, reqSegments, _i, _len, _ref;
    req.params = {};
    reqSegments = Path.segment(parseUrl(req.url).pathname);
    _ref = this.path.parameters;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      parameter = _ref[_i];
      req.params[parameter.name] = reqSegments[parameter.pos];
    }
    middleware = _.flatten(this.middleware);
    callbacks = function(err) {
      var callback;
      callback = middleware.shift();
      if (err && callback) {
        if (callback.length >= 4) {
          return callback(err, req, res, callbacks);
        } else {
          return callbacks(err);
        }
      } else if (callback) {
        return callback(req, res, callbacks);
      } else {
        return next(err);
      }
    };
    return callbacks();
  };

  return Route;

})();

module.exports = Route;
