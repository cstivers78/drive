const fs = require('fs');

const method = /(DELETE|GET|POST|PUT|CONNECT)/;
const uri = /(\/\S*)+/
const handler = /((?:\/?[a-zA-Z0-9_-]+)+)(?:\.([a-zA-Z0-9_-]+))?/;

parseLine = function(line,lineno,filename) {

  const result = {};

  const methodInput = line.substr(0);
  const methodMatch = method.exec(methodInput);
  if ( !methodMatch )
    throw ['Unable to parse method at ',filename,':',lineno].join('');
  
  result.method = methodMatch[1];

  const uriInput = methodInput.substr(methodMatch.index+methodMatch[0].length);
  const uriMatch = uri.exec(uriInput);
  if ( !uriMatch )
    throw ['Unable to parse route uri at ',filename,':',lineno].join('');
  
  result.uri = uriMatch[1];

  const handlerInput = uriInput.substr(uriMatch.index+uriMatch[0].length);
  const handlerMatch = handler.exec(handlerInput);
  if ( !handlerMatch )
    throw ['Unable to parse handler at ',filename,':',lineno].join('');

  result.handler = {};
  result.handler.file = handlerMatch[1];
  result.handler.name = handlerMatch[2];
  result.handler.args = handlerMatch[3];
  result.debug = {
    line: line,
    lineno: lineno,
    filename: filename
  }

  return result;
};

parseBlock = function(block,filename) {
  return block.split('\n').reduce(function(routes,line,lineno,lines){
    line = line.trim();
    try {
      if ( line.length > 0 && line[0] != '#' ) {
        const route = parseLine(line,lineno+1,filename);
        routes.push(route);
      }
    }
    catch (thrown) {
      const message = [thrown,'at line',no,':\n   ',line].join('');
      throw message;
    }
    return routes;
  },[]);
};

parseFile = function(filename) {
  return parseBlock(fs.readFileSync(filename,'utf8'),filename);
};

module.exports = {
  parseFile: parseFile,
  parseBlock: parseBlock,
  parseLine: parseLine
};