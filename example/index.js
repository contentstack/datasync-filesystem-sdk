const path = require('path')
const Contentstack = require('../dist').Contentstack

const Stack = Contentstack.Stack({
  contentStore: {
    baseDir: path.join(__dirname, '..', '..', 'boilerplate', '_development_contents'),
  }
})

function connect () {
  return Stack.connect()
}

function find (contentType = 'blog') {
  return Stack.contentType(contentType)
    .entries()
    .includeReferences()
    .find()
}

return connect()
  .then(() => {
    return find()
      .then(() => { });
  })
  .catch(console.error)
