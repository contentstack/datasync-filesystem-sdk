var Contentstack = (require('./core/contentstack'))
var config = require('config')
var Stack = Contentstack.Stack(config.get('content-connector'))

module.exports = Stack
