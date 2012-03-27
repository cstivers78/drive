_ = require 'underscore'

response = module.exports

response.render = (view, args...) -> 
  viewPath = 
    if view._path?
      view._path
    else if view.filename?
      view.filename
    else
      view
  (req, res, next) ->
    viewArgs = for arg in args 
      if _.isFunction arg
        arg(req,res,next)
      else
        arg
    res.render viewPath, viewArgs...

response.redirect = (url) -> (req, res, next) ->
  res.redirect url

response.clearCookie = (name) -> (req, res, next) -> 
  res.clearCookie(name)
  next?()
