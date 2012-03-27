var Node, Path, PatternNode, Route, Router, ValueNode, _,
  __slice = Array.prototype.slice,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Path = require('./path');

Route = require('./route');

Router = (function() {
  var find, findAndCreate, findMatch, findPattern, match, register1, register2;

  function Router() {
    this.root = new Node;
    this.routes = [];
  }

  findPattern = function(pattern) {
    return function(node) {
      return (node.pattern != null) && node.pattern === pattern;
    };
  };

  findMatch = function(segment) {
    return function(node) {
      return (node.pattern != null) && node.pattern.exec(segment) !== null;
    };
  };

  match = function(current, segment) {
    var node;
    if ((current != null) && current.value === '*') {
      return current;
    } else if ((current != null) && (segment != null)) {
      if (current.values[segment] != null) {
        return current.values[segment];
      } else {
        node = _.find(current.patterns, findMatch(segment));
        return node != null ? node : current.fallback();
      }
    } else {
      return;
    }
  };

  find = function(current, segment) {
    var _ref;
    if ((current != null) && (segment != null)) {
      if ((segment.name != null) && (segment.pattern != null)) {
        return _.find(current.patterns, findPattern(segment.pattern));
      } else {
        return (_ref = current.values[segment]) != null ? _ref : current.catchcall;
      }
    } else {
      return;
    }
  };

  findAndCreate = function(current, segment) {
    var _ref;
    if ((current != null) && (current != null ? current.value : void 0) === '*') {
      return current;
    } else if ((segment != null) && (segment.name != null) && (segment.pattern != null)) {
      if (!(current.patterns[segment.pattern] != null)) {
        return current.patterns[segment.pattern] = new PatternNode(current, segment.pattern);
      } else {
        return current.patterns[segment.pattern];
      }
    } else if (segment === '*') {
      if (!(current.catchall != null)) {
        return current.catchall = new ValueNode(current, segment);
      } else {
        return current.catchall;
      }
    } else {
      if (!((_ref = current.values) != null ? _ref[segment] : void 0)) {
        return current.values[segment] = new ValueNode(current, segment);
      } else {
        return current.values[segment];
      }
    }
  };

  Router.prototype.add = function(route) {
    var node;
    node = route.path.segments.reduce(findAndCreate, this.root);
    if (node != null) return node.methods[route.method] = route;
  };

  Router.prototype.remove = function(route) {
    var node;
    node = route.path.segments.reduce(find, this.root);
    if (node != null) return delete node.methods[route.method];
  };

  Router.prototype.lookup = function(path, method) {
    var node;
    if ((path != null) && (method != null)) {
      if (!(path instanceof Path)) path = new Path(path);
      node = path.segments.reduce(find, this.root);
      if (node) {
        return node.methods[method];
      } else {
        return;
      }
    } else {
      return;
    }
  };

  Router.prototype.match = function(path, method) {
    return Path.segment(path).reduce(match, this.root);
  };

  register1 = function(self, method) {
    return function() {
      var middleware, path;
      path = arguments[0], middleware = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return self.register.apply(self, [method, path].concat(__slice.call(middleware)));
    };
  };

  register2 = function(self, method, path) {
    return function() {
      var middleware;
      middleware = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return self.register.apply(self, [method, path].concat(__slice.call(middleware)));
    };
  };

  Router.prototype.register = function() {
    var method, middleware, path;
    method = arguments[0], path = arguments[1], middleware = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if ((method != null) && (path != null) && (middleware != null)) {
      return this.add((function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(Route, [method, path].concat(__slice.call(middleware)), function() {}));
    } else if ((method != null) && (path != null)) {
      return register2(this, method, path);
    } else if (method != null) {
      return register1(this, method);
    } else {
      return register.bind(this);
    }
  };

  return Router;

})();

Node = (function() {

  function Node(parent) {
    this.parent = parent;
    this.methods = {};
    this.values = {};
    this.patterns = {};
    this.catchall = void 0;
  }

  Node.prototype.method = function(m) {
    return this.methods[m];
  };

  Node.prototype.fallback = function() {
    if (this.catchall != null) {
      return this.catchall;
    } else if (this.parent) {
      return this.parent.fallback();
    } else {
      return;
    }
  };

  return Node;

})();

ValueNode = (function(_super) {

  __extends(ValueNode, _super);

  function ValueNode(parent, value) {
    this.value = value;
    ValueNode.__super__.constructor.call(this, parent);
  }

  ValueNode.prototype.toString = function() {
    return this.value;
  };

  return ValueNode;

})(Node);

PatternNode = (function(_super) {

  __extends(PatternNode, _super);

  function PatternNode(parent, pattern) {
    this.pattern = pattern;
    PatternNode.__super__.constructor.call(this, parent);
  }

  PatternNode.prototype.toString = function() {
    return this.pattern.toString();
  };

  return PatternNode;

})(Node);

module.exports = Router;
