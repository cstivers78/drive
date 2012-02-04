var Path, anyPattern, emptySegment, parameterSegment;

anyPattern = /.*/;

emptySegment = function(segment) {
  return segment.trim().length > 0;
};

parameterSegment = function(segment) {
  return (segment != null) && (segment.name != null) && (segment.pattern != null);
};

Path = (function() {
  var parseSegments;

  function Path(string) {
    this.string = string;
    this.segments = parseSegments(this.string);
    this.parameters = this.segments.filter(parameterSegment);
  }

  parseSegments = function(str) {
    return Path.segment(str).map(function(segment, pos) {
      var name, p1, p2, pattern;
      name = pattern = void 0;
      if (segment[0] === ':') {
        p1 = segment.indexOf('(');
        if (p1 >= 0) {
          name = segment.substring(1, p1);
          p2 = segment.indexOf(')', p1);
          if (p2 >= 0) pattern = new RegExp(segment.substring(p1 + 1, p2));
        } else {
          name = segment.substring(1);
        }
      }
      if (name != null) {
        return {
          name: name,
          pattern: pattern != null ? pattern : pattern = anyPattern,
          pos: pos
        };
      } else {
        return segment;
      }
    });
  };

  return Path;

})();

Path.segment = function(str) {
  return str.split('/').filter(emptySegment);
};

module.exports = Path;
