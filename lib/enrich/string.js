var FORMAT_PARAMETER_PATTERN;

FORMAT_PARAMETER_PATTERN = /\@\(([a-zA-Z](?:[a-zA-Z0-9_]*))\)/g;

String.prototype.format = function(parameters) {
  var value;
  value = this.valueOf();
  return value.replace(FORMAT_PARAMETER_PATTERN, function(match, name) {
    var _ref;
    return (_ref = parameters != null ? parameters[name] : void 0) != null ? _ref : "<>";
  });
};
