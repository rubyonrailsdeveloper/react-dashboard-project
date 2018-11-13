const express = require('express')
const fallback = require('express-history-api-fallback')
const app = express()
const root = __dirname + '/dist'

app.use(express.static(__dirname + '/dist'))
app.use(fallback('index.html', { root }))
app.set('port', process.env.PORT || 3001)

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'))
})
