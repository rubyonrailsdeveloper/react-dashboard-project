// tslint:disable
require('intersection-observer')

if (process.env.NODE_ENV === 'production') {
  module.exports = require('src/index.prod')
} else {
  module.exports = require('src/index.dev')
}
