var parseUrl;

parseUrl = require('url').parse;

module.exports = function(router) {
  return function(req, res, next) {
    var node, route, url;
    try {
      url = parseUrl(req.url);
      node = router.match(url.pathname);
      if (node != null) {
        route = node.method(req.method);
        if (route != null) {
          return route.apply(req, res, next);
        } else {
          return next();
        }
      } else {
        return next();
      }
    } catch (thrown) {
      return next();
    }
  };
};
