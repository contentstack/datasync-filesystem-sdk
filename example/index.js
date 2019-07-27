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
    .find()
}

return connect()
  .then(() => {
    return find()
      .then((result) => {
        // Sample output
        // {
        //   entries: [
        //     {
        //       title: 'French author',
        //       gender: null,
        //       age: null,
        //       summary: '',
        //       tags: [

        //       ],
        //       locale: 'es-es',
        //       uid: 'blt17559b99fee73d6f'
        //     }
        //   ],
        //   content_type_uid: 'authors',
        //   locale: 'es-es'
        // }
        console.log(JSON.stringify(result, null, 2))
      })
  })
  .catch(console.error)
