
module.exports = function(options){
  return function(req, res, next) {
    res.setHeader('X-Powered-By', 'Drive');
    // req.app = res.app = app;
    req.res = res;
    res.req = req;
    req.next = next;

    // req.__proto__ = app.request;
    // res.__proto__ = app.response;

    res.locals = function(obj){
      for (var key in obj) res.locals[key] = obj[key];
      return res;
    };

    next();
  };
};
