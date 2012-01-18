var fs, handler, method, parseBlock, parseLine, uri;

fs = require('fs');

method = /(DELETE|GET|POST|PUT|CONNECT)/;

uri = /(\/\S*)+/;

handler = /((?:\/?[a-zA-Z0-9_-]+)+)(?:\.([a-zA-Z0-9_-]+))?/;

parseLine = function(line, lineno, filename) {
  var handlerInput, handlerMatch, methodInput, methodMatch, result, uriInput, uriMatch;
  result = {};
  methodInput = line.slice(0);
  methodMatch = method.exec(methodInput);
  if (!methodMatch) {
    throw ['Unable to parse method at ', filename, ':', lineno].join('');
  }
  result.method = methodMatch[1];
  uriInput = methodInput.substr(methodMatch.index + methodMatch[0].length);
  uriMatch = uri.exec(uriInput);
  if (!uriMatch) {
    throw ['Unable to parse route uri at ', filename, ':', lineno].join('');
  }
  result.uri = uriMatch[1];
  handlerInput = uriInput.substr(uriMatch.index + uriMatch[0].length);
  handlerMatch = handler.exec(handlerInput);
  if (!handlerMatch) {
    throw ['Unable to parse handler at ', filename, ':', lineno].join('');
  }
  result.handler = {
    file: handlerMatch[1],
    name: handlerMatch[2],
    args: handlerMatch[3]
  };
  result.debug = {
    line: line,
    lineno: lineno,
    filename: filename
  };
  return result;
};

parseBlock = function(block, filename) {
  var _reduce;
  _reduce = function(routes, line, lineno, lines) {
    var message, route;
    line = line.trim();
    try {
      if (line.length > 0 && line[0] !== '#') {
        route = parseLine(line, lineno + 1, filename);
        routes.push(route);
      }
    } catch (thrown) {
      message = [thrown, 'at line', false, ':\n   ', line].join('');
      throw message;
    }
    return routes;
  };
  return block.split('\n').reduce(_reduce, []);
};

module.exports = function(filename) {
  return parseBlock(fs.readFileSync(filename, 'utf8'), filename);
};
