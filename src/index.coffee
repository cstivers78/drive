
Application = require './application'

main = 
  app: new Application(require.main)
  middleware: 
    response: require './middleware/response'
  extractor: 
    request: require './extractor/request'

Object.defineProperty global, 'app', get: -> main.app
Object.defineProperty global, 'models', get: -> main.app.models
Object.defineProperty global, 'views', get: -> main.app.views
Object.defineProperty global, 'routes', get: -> main.app.routes
Object.defineProperty global, 'assets', get: -> main.app.assets
Object.defineProperty global, 'public', get: -> main.app.public

module.exports = main