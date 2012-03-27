var request;

request = function(req, res, next) {
  return req;
};

request.query = function(name, orElse) {
  return function(req, res, next) {
    var _ref;
    return (_ref = req.query[name]) != null ? _ref : orElse;
  };
};

request.param = function(name, orElse) {
  return function(req, res, next) {
    var _ref, _ref2;
    return (_ref = (_ref2 = req.param[name]) != null ? _ref2 : req.query[name]) != null ? _ref : orElse;
  };
};

module.exports = request;
