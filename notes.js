// set master language
// if not set - set it to en-us
// OR
// set it to the 1st lang found in config

// What if the user does not call init?

/**
 * Understand how CachePolicy - Provider works @ninad
 */

/**
 * entries vs assets
 * - assets should not have includeContentType
 * - include reference is not supported
 * 
 */

/**
 * search - user can do this on his own
 * addParams - since db instance is exposed, the user can do this himself
 */

// suggestions
this._query.locale
this._query.content_type_uid
this._query.uid
this._query.count
this._query.includeCount
// this._query.includeReference
this._query.includeReferences
this._projections (only, base)
this._options (skip, limit, sort)
 // - sorting based on key


// this will clear the previous queries
this._query = null
None


// Sample Query
const Stack = Contentstack.Stack({
  api_key: '',
  access_token: ''
})

Stack.init({
  // mongoconfig
})

// if its a collection, return an array, else an object

Stack.contentType('abc') // { content_type: { //schema }}
  //.entries() // { entries: []}
 // .query({
  //   uid: {
  //     $in: []
  //   }
  // })
  //.tags([])
  //*** // .includeReference([])
  // .includeReferences()
  // .includeContentType()
  // .only([])
  // .except([])
  .skip()
  .limit()
  .ascending('')
  .and(Query1, Query2)
  .or(Query1, Query2)
  .descending('')
  //.includeCount() // { entries: [], content_type: {}, count: 8 }
  //.getQuery() // Returns the current query
  .regex()
  .find()
  .fetch() // add this?
  .findOne() // add this?
  //.count() // this._query.countOnly = true


// {
//   entries: [],
//   content_type_uid: '',
//   locale: '',
//   content_type: {

//   },
//   count: 0
// }

// {
//   entry: {},
//   content_type_uid: '',
//   locale: '',
//   content_type: {

//   },
//   count: 0
// }