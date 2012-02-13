parseUrl = require('url').parse

module.exports = (router) -> (req, res, next) ->
  try
    url = parseUrl req.url
    node = router.match url.pathname
    if node?
      route = node.method(req.method)
      if route?
        route.apply req, res, next
      else
        next()
    else
      next()
  catch thrown
    next()
