_ = require 'underscore'

module.exports.render = (view, args...) -> (req, res, next) ->
  viewArgs = for arg in args 
    if _.isFunction arg
      arg(req)
    else
      arg.toString()
  res.render view.filename, req, viewArgs...

module.exports.redirect = (url) -> (req, res, next) ->
  res.redirect url

module.exports.query = (field) -> (req) -> req.query[field]
