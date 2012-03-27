
request = (req,res,next) -> 
  req

request.query = (name, orElse) -> (req, res, next) -> 
  req.query[name] ? orElse

request.param = (name, orElse) -> (req, res, next) -> 
  req.param[name] ? req.query[name] ? orElse

module.exports = request