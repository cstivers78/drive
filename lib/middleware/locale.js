var HEADER_PARAM, HEADER_PARAMS, HEADER_VALUES, acceptedLanguages, matchLocale, parseQuality, parseUrl, quality;

parseUrl = require('url').parse;

require('../enrich/string');

module.exports = function(options) {
  return function(req, res, next) {
    req.acceptedLanguages = acceptedLanguages(req);
    req.locale = req.acceptedLanguages.reduce(matchLocale(app.conf.locales), void 0);
    if (req.locale === void 0) req.locale = app.conf.locales['en'];
    return next();
  };
};

matchLocale = function(locales) {
  return function(left, right) {
    if (!(left != null)) {
      return locales[right];
    } else {
      return left;
    }
  };
};

acceptedLanguages = function(req) {
  var accept;
  accept = req.header('Accept-Language');
  if (accept != null) {
    return parseQuality(accept).map(function(obj) {
      return obj.value;
    });
  } else {
    return [];
  }
};

HEADER_PARAMS = new RegExp(' *, *');

HEADER_VALUES = new RegExp(' *; *');

HEADER_PARAM = new RegExp(' *= *');

parseQuality = function(str) {
  return str.split(HEADER_PARAMS).map(quality).filter(function(obj) {
    return obj.quality;
  }).sort(function(a, b) {
    return b.quality - a.quality;
  });
};

quality = function(str) {
  var parts;
  parts = str.split(HEADER_VALUES);
  return {
    value: parts[0],
    quality: parts[1] ? parseFloat(parts[1].split(HEADER_PARAM)[1]) : 1
  };
};
