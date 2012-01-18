path = require 'path'
parse = require('url').parse
_ = require 'underscore'

module.exports = (options) ->
  options ?= {}

  assetsPath = options.path ? process.cwd();
  compilers = options.compilers ? [];
  
  return (req, res, next) ->
    if 'GET' != req.method 
      return next()

    pathname = parse(req.url).pathname.substring(1)

    compiled = compilers.some (compiler) ->
      if compiler.match.test pathname 
        filename = path.resolve assetsPath, pathname.replace(compiler.target, compiler.source)
        if path.existsSync filename
          try
            compiler.compileFile filename, null, (err,result) ->
              if err
                if err.code && 'ENOENT' == err.code
                  next()
                else
                  next err
              else
                res.setHeader 'Content-Type', compiler.targetContentType
                res.setHeader 'Content-Length', result.length
                res.send result
          catch thrown
            next thrown
          return true
      return false
    
    if !compiled
      next()
