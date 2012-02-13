parseUrl = require('url').parse
require('../enrich/string')

module.exports = (options) -> (req, res, next) ->
  req.acceptedLanguages = acceptedLanguages(req);
  req.locale = req.acceptedLanguages.reduce matchLocale(app.conf.locales), undefined
  if req.locale is undefined
    req.locale = app.conf.locales['en']
  next()


matchLocale = (locales) -> (left,right) ->
  if not left?
    locales[right]
  else
    left
    

acceptedLanguages = (req) ->
  accept = req.header 'Accept-Language'
  if accept?
    parseQuality(accept).map((obj) -> obj.value)
  else
    []

HEADER_PARAMS = new RegExp(' *, *');
HEADER_VALUES = new RegExp(' *; *');
HEADER_PARAM = new RegExp(' *= *');

parseQuality = (str) ->
  str
    .split(HEADER_PARAMS)
    .map(quality)
    .filter((obj) -> obj.quality)
    .sort((a, b) -> b.quality - a.quality)

quality = (str) ->
  parts = str.split(HEADER_VALUES)
  return { 
    value: parts[0]
    quality: if parts[1] then parseFloat(parts[1].split(HEADER_PARAM)[1]) else 1 
  }
