anyPattern = /.*/
emptySegment = (segment) -> segment.trim().length > 0
parameterSegment = (segment) -> segment? and segment.name? and segment.pattern?

class Path

  constructor: (@string) ->
    @segments = parseSegments(@string)
    @parameters = @segments.filter(parameterSegment)
  
  parseSegments = (str) ->
    Path.segment(str).map (segment,pos) ->
      name = pattern = undefined

      if segment[0] is ':'
        p1 = segment.indexOf '('
        if ( p1 >= 0)
          name = segment.substring 1, p1
          p2 = segment.indexOf ')', p1
          if ( p2 >= 0 )
            pattern = new RegExp segment.substring p1+1, p2
        else
          name = segment.substring 1
      
      if name?
        {name: name, pattern: pattern ?= anyPattern, pos: pos }
      else
        segment


Path.segment = (str) -> str.split('/').filter(emptySegment)


module.exports = Path