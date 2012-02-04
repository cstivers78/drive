var _,
  __slice = Array.prototype.slice;

_ = require('underscore');

module.exports.render = function() {
  var args, view;
  view = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  return function(req, res, next) {
    var arg, viewArgs;
    viewArgs = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        if (_.isFunction(arg)) {
          _results.push(arg(req));
        } else {
          _results.push(arg.toString());
        }
      }
      return _results;
    })();
    return res.render.apply(res, [view.filename, req].concat(__slice.call(viewArgs)));
  };
};

module.exports.redirect = function(url) {
  return function(req, res, next) {
    return res.redirect(url);
  };
};

module.exports.query = function(field) {
  return function(req) {
    return req.query[field];
  };
};
