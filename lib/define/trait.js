const _ = require('underscore');

const base = function(arg) {
  if ( !_.isArray(arg) )
    return [arg];
  return arg;
};

const props = function(arg) {
  if ( _.isUndefined(arg) || _.isNull(arg) || _.isArray(arg) || _.isFunction(arg) || _.isString(arg) || _.isBoolean(arg) || _.isNumber(arg) || _.isDate(arg) || _.isRegExp(arg) ) {
    return {};
  }
  else {
    _.each(arg, function(v,k) {
      if ( !v || !v['value'] )
        arg[k] = { value: v, writable: true, enumerable: true };
    });
    return arg;
  }
};

const configure = function(args) {
  switch (args.length) {
    case 2 :
      return {
        base: base(args[0]),
        props: props(args[1])
      }
    case 1 :
      if ( _.isArray(args[0]) || _.isFunction(args[0]) ) {
        return {
          base: base(args[0]),
          props: props()
        }
      }
      else {
        return {
          base: base(),
          props: props(args[0])
        }
      }
    case 0 :
      return {
        base: base(),
        props: props()
      }
    default :
      return {
        base: base(args[0]),
        props: props(args[1])
      }
  }
};

module.exports = function() {

  var config = configure(arguments),
      trait;

  trait = {};

  config.base.forEach(function(b){
    _.extend(trait,b);
  });
  
  Object.defineProperties(trait,config.props);

  return trait;
};