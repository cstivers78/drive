var response, _,
  __slice = Array.prototype.slice;

_ = require('underscore');

response = module.exports;

response.render = function() {
  var args, view, viewPath;
  view = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  viewPath = view._path != null ? view._path : view.filename != null ? view.filename : view;
  return function(req, res, next) {
    var arg, viewArgs;
    viewArgs = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        if (_.isFunction(arg)) {
          _results.push(arg(req, res, next));
        } else {
          _results.push(arg);
        }
      }
      return _results;
    })();
    return res.render.apply(res, [viewPath].concat(__slice.call(viewArgs)));
  };
};

response.redirect = function(url) {
  return function(req, res, next) {
    return res.redirect(url);
  };
};

response.clearCookie = function(name) {
  return function(req, res, next) {
    res.clearCookie(name);
    return typeof next === "function" ? next() : void 0;
  };
};
