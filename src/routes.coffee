fs = require 'fs'

method = /(DELETE|GET|POST|PUT|CONNECT)/
uri = /(\/\S*)+/
handler = /((?:\/?[a-zA-Z0-9_-]+)+)(?:\.([a-zA-Z0-9_-]+))?/

parseLine = (line,lineno,filename) ->

  result = {}

  methodInput = line[0..]
  methodMatch = method.exec methodInput
  if !methodMatch
    throw ['Unable to parse method at ',filename,':',lineno].join('')
  
  result.method = methodMatch[1]

  uriInput = methodInput.substr methodMatch.index + methodMatch[0].length
  uriMatch = uri.exec uriInput
  if !uriMatch
    throw ['Unable to parse route uri at ',filename,':',lineno].join('')
  
  result.uri = uriMatch[1]

  handlerInput = uriInput.substr uriMatch.index + uriMatch[0].length
  handlerMatch = handler.exec handlerInput
  if !handlerMatch
    throw ['Unable to parse handler at ',filename,':',lineno].join('')

  result.handler = 
    file: handlerMatch[1]
    name: handlerMatch[2]
    args: handlerMatch[3]
  
  result.debug =
    line: line,
    lineno: lineno,
    filename: filename

  result

parseBlock = (block,filename) ->
  _reduce = (routes,line,lineno,lines) ->
    line = line.trim()
    try
      if line.length > 0 && line[0] != '#'
        route = parseLine line, lineno+1, filename
        routes.push route
    catch thrown
      message = [thrown,'at line',no,':\n   ',line].join('')
      throw message
    routes
  block.split('\n').reduce _reduce, []

module.exports = (filename) ->
  parseBlock fs.readFileSync(filename,'utf8'), filename
