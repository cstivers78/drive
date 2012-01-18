
module.exports = function(options) {
  return function(req, res, next) {
    res.setHeader('X-Powered-By', 'Drive');
    return next();
  };
};
