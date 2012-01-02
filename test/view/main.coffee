
edge = require('../../lib/edge')
minify = require('html-minifier')
timers = require('timers')

edge.basepath(__dirname)

people = [
  {name: 'Bob', dob: '1978-09-22'},
  {name: 'Bill', dob: '1978-09-24'},
  {name: 'Barry', dob: '1978-09-26'},
  {name: 'Brian', dob: '1978-10-1'},
  {name: 'Brad', dob: '1978-10-2'},
  {name: 'Ben', dob: '1978-10-16'},
  {name: 'Bart', dob: '1978-11-24'},
  {name: 'Burt', dob: '1978-12-2'},
]


minifyhtml = (html) ->
  console.log minify.minify html, 
    collapseWhitespace: true
    removeAttributeQuotes: true
    collapseBooleanAttributes: true

renderLimit = 100
times = []
html = undefined

start = () ->
  console.time("rendering "+renderLimit)
  render(1)

stop = () ->
  console.timeEnd("rendering "+renderLimit)
  times = times.sort((a,b)-> a-b)
  sum = times.reduce (a,b) -> a+b
  avg = sum / times.length
  min = times[0]
  max = times[times.length-1]
  med = (max-min) / 2
  console.log "times: ", times.join(', ')
  console.log "max: ", max
  console.log "min: ", min
  console.log "avg: ", avg
  console.log "med: ", times[Math.round(times.length/2)]
  console.log "sum: ", sum
  console.log "----------------"
  console.log html

render = (i) ->
  # console.time("iteration #"+i)
  start = new Date()
  edge.render process.argv[2], {people}, (success,result) ->
    end = new Date()
    times.push end-start
    html = result
    # console.log result
    # console.timeEnd("iteration #"+i)
    if i < renderLimit then render(i+1) else stop()


start()