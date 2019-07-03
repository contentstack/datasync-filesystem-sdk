const Contentstack = require('../dist').Contentstack

const Stack = Contentstack.Stack({
  contentStore: {
    baseDir: '/home/ramanathan/Documents/contentstack/datasync/boilerplate/_contents'
  }
})

function connect () {
  return Stack.connect()
}

function find (contentType = 'blog') {
  return Stack.contentType(contentType)
    .entries()
    .include([
      'modular_blocks.block_1.reference'
    ])
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
