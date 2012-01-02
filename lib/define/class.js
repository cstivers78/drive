
_ = require('underscore');


const construct = function(clazz,object,base,props,args){
  if ( object['init'] ) {
    object.init.apply(object,args);
  }
  else if ( base[0] ) {
    base[0].apply(object,args);
  }
};

const base = function(arg) {
  var base = [];
  if ( !arg ) {
    base.push(Object);
  }
  else if ( _.isArray(arg) ) {
    if ( ! _.isFunction(arg[0]) ) {
      base.push(Object);
    }
    arg.forEach(function(a){
      if ( a != null)
        base.push(a);
    });
  }
  else if ( _.isFunction(arg) ) {
    base.push(arg);
  }
  else {
    base.push(Object);
    base.push(arg);
  }
  return base;
};

const props = function(arg) {
  if ( _.isUndefined(arg) || _.isNull(arg) || _.isArray(arg) || _.isFunction(arg) || _.isString(arg) || _.isBoolean(arg) || _.isNumber(arg) || _.isDate(arg) || _.isRegExp(arg) ) {
    return {};
  }
  else {
    _.each(arg, function(v,k) {
      if ( !v  || (!v['value'] && !v['get'] && !v['set']) ) {
        arg[k] = { value: v, writable: true, enumerable: true };
      }
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
      clazz;

  clazz = function() {
    construct(clazz,this,config.base,config.props,arguments);
  };
  
  if ( config.base.length > 0 ) {
    clazz.prototype = Object.create(config.base[0].prototype);
    for ( i=1; i<config.base.length; i++ ) {
      _.extend(clazz.prototype,config.base[i]);
    }
  }

  Object.defineProperties(clazz.prototype,config.props);
  
  return clazz;
}