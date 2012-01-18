module.exports = (options) ->
  return (req, res, next) ->
    res.setHeader 'X-Powered-By', 'Drive'
    next()