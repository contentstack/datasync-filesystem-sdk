/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

import mask from 'json-mask'
import {
  merge,
  reverse,
  sortBy,
  mergeWith,
  isArray
} from 'lodash'
import sift from 'sift'
import {
  existsSync,
  readFile,
} from './fs'
import {
  difference,
  // doNothingClause,
  getAssetsPath,
  getContentTypesPath,
  getEntriesPath,
  segregateQueries,
} from './utils'
import { WARNING_MESSAGES } from './messages'

interface IShelf {
  path: string,
  position: string,
  uid: string,
}

interface IQuery {
  $or: Array < {
    _content_type_uid: string,
    _version?: {
      $exists: boolean,
    },
    uid: string,
    // Since collection name deterines the locale
    locale?: string,
  } >
}

const extend = {
  compare(type) {
    return function(key, value) {
      if (typeof key === 'string' && typeof value !== 'undefined') {
        this.q.query = this.q.query || {}
        this.q.query[key] = this.q.query[key] || {}
        this.q.query[key][type] = value

        return this
      }
      throw new Error(`Kindly provide valid parameters for ${type}`)
    }
  },
  contained(bool) {
    const type = (bool) ? '$in' : '$nin'

    return function(key, value) {
      if (typeof key === 'string' && typeof value === 'object' && Array.isArray(value)) {
        this.q.query = this.q.query || {}
        this.q.query[key] = this.q.query[key] || {}
        this.q.query[key][type] = this.q.query[key][type] || []
        this.q.query[key][type] = this.q.query[key][type].concat(value)

        return this
      }
      throw new Error(`Kindly provide valid parameters for ${bool}`)
    }
  },
  exists(bool) {
    return function(key) {
      if (key && typeof key === 'string') {
        this.q.query = this.q.query || {}
        this.q.query[key] = this.q.query[key] || {}
        this.q.query[key].$exists = bool

        return this
      }
      throw new Error(`Kindly provide valid parameters for ${bool}`)
    }
  },
  // TODO
  logical(type) {
    return function(query) {
      this.q.query = this.q.query || {}
      this.q.query[type] = query

      return this
    }
  },
  sort(type) {
    return function(key) {
      if (key && typeof key === 'string') {
        this.q[type] = key

        return this
      }
      throw new Error(`Kindly provide valid parameters for sort-${type}`)
    }
  },
  pagination(type) {
    return function(value) {
      if (typeof value === 'number') {
        this.q[type] = value

        return this
      }
      throw new Error('Argument should be a number.')

    }
  },
}

/**
 * @summary
 *  Expose SDK query methods on Stack
 * @returns {this} - Returns `stack's` instance
 */
export class Stack {
  // TODO
  public config: any
  public readonly contentStore: any
  public readonly types: any
  public readonly projections: string[]
  public readonly q: any
  public readonly lessThan: (key: string, value: any) => Stack
  public readonly lessThanOrEqualTo: (key: string, value: any) => Stack
  public readonly greaterThan: (key: string, value: any) => Stack
  public readonly greaterThanOrEqualTo: (key: string, value: any) => Stack
  public readonly notEqualTo: (key: string, value: any) => Stack
  public readonly containedIn: (key: string, value: any) => Stack
  public readonly notContainedIn: (key: string, value: any) => Stack
  public readonly exists: (key: string) => Stack
  public readonly notExists: (key: string) => Stack
  public readonly ascending: (key: string) => Stack
  public readonly descending: (key: string) => Stack
  public readonly skip: (value: any) => Stack
  public readonly limit: (value: any) => Stack
  public readonly or: (query: any) => Stack
  public readonly nor: (query: any) => Stack
  public readonly not: (query: any) => Stack
  public readonly and: (query: any) => Stack

  constructor(config) {
    // app config
    this.config = config
    this.contentStore = config.contentStore
    this.projections = Object.keys(this.contentStore.projections)
    this.types = config.contentStore.internal.types
    this.q = this.q || {}
    this.q.query = this.q.query || {}

    /**
     * @public
     * @method lessThan
     * @description Retrieves entries in which the value of a field is lesser than the provided value
     * @param {String} key - uid of the field
     * @param {*} value - Value used to match or compare
     * @example
     * let blogQuery = Stack.contentType('example').entries()
     * let data = blogQuery.lessThan('created_at','2015-06-22').find()
     * data.then((result) => {
     *   // result content the data who's 'created_at date'
     *   // is less than '2015-06-22'
     * }).catch((error) => {
     *   // error trace
     * })
     * @returns {this} - Returns `stack's` instance
     */
    this.lessThan = extend.compare('$lt')

    /**
     * @public
     * @method lessThanOrEqualTo
     * @description Retrieves entries in which the value of a field is lesser than or equal to the provided value.
     * @param {String} key - uid of the field
     * @param {*} value - Value used to match or compare
     * @example
     * let blogQuery = Stack.contentType('example').entries()
     * let data = blogQuery.lessThanOrEqualTo('created_at','2015-06-22').find()
     * data.then((result) => {
     *   // result contain the data of entries where the
     *   //'created_at' date will be less than or equalto '2015-06-22'.
     * }).catch((error) => {
     *   // error trace
     * })
     * @returns {this} - Returns `stack's` instance
     */
    this.lessThanOrEqualTo = extend.compare('$lte')

    /**
     * @public
     * @method greaterThan
     * @description Retrieves entries in which the value for a field is greater than the provided value.
     * @param {String} key - uid of the field
     * @param {*} value -  value used to match or compare
     * @example
     * let blogQuery = Stack.contentType('example').entries()
     * let data = blogQuery.greaterThan('created_at','2015-03-12').find()
     * data.then((result) => {
     *   // result contains the data of entries where the
     *   //'created_at' date will be greaterthan '2015-06-22'
     * }).catch((error) => {
     *   // error trace
     * })
     * @returns {this} - Returns `stack's` instance
     */
    this.greaterThan = extend.compare('$gt')

    /**
     * @public
     * @method greaterThanOrEqualTo
     * @description Retrieves entries in which the value for a field is greater than or equal to the provided value.
     * @param {String} key - uid of the field
     * @param {*} value - Value used to match or compare
     * @example
     * let blogQuery = Stack.contentType('example').entries()
     * let data = blogQuery.greaterThanOrEqualTo('created_at','2015-03-12').find()
     * data.then((result) => {
     *   // result contains the data of entries where the
     *   //'created_at' date will be  greaterThan or equalto '2015-06-22'
     * }).catch((error) => {
     *   // error trace
     * })
     * @returns {this} - Returns `stack's` instance
     */
    this.greaterThanOrEqualTo = extend.compare('$gte')

    /**
     * @public
     * @method notEqualTo
     * @description Retrieves entries in which the value for a field does not match the provided value.
     * @param {String} key - uid of the field
     * @param {*} value - Value used to match or compare
     * @example
     * let blogQuery = Stack.contentType('example').entries()
     * let data = blogQuery.notEqualTo('title','Demo').find()
     * data.then((result) => {
     *   // ‘result’ contains the list of entries where value
     *   // of the ‘title’ field will not be 'Demo'.
     * }).catch((error) => {
     *   // error trace
     * })
     * @returns {this} - Returns `stack's` instance
     */
    this.notEqualTo = extend.compare('$ne')

    /**
     * @public
     * @method containedIn
     * @description Retrieve entries in which the value of a field matches with any of the provided array of values
     * @param {String} key - uid of the field
     * @param {*} value - Array of values that are to be used to match or compare
     * @example
     * let blogQuery = Stack.contentType('example').entries().query();
     * let data = blogQuery.containedIn('title', ['Demo', 'Welcome']).find()
     * data.then((result) => {
     *   // ‘result’ contains the list of entries where value of the
     *   // ‘title’ field will contain either 'Demo' or ‘Welcome’.
     * }).catch((error) => {
     *   // error trace
     * })
     * @returns {this} - Returns `stack's` instance
     */
    this.containedIn = extend.contained(true)

    /**
     * @public
     * @method notContainedIn
     * @description Retrieve entries in which the value of a field does not match
     *              with any of the provided array of values.
     * @param {String} key - uid of the field
     * @param {Array} value - Array of values that are to be used to match or compare
     * @example
     * let blogQuery = Stack.contentType('example').entries()
     * let data = blogQuery.notContainedIn('title', ['Demo', 'Welcome']).find()
     * data.then((result) => {
     *   // 'result' contains the list of entries where value of the
     *   //title field should not be either "Demo" or ‘Welcome’
     * }).catch((error) => {
     *   // error trace
     * })
     * @returns {this} - Returns `stack's` instance
     */
    this.notContainedIn = extend.contained(false)

    /**
     * @public
     * @method exists
     * @description Retrieve entries if value of the field, mentioned in the condition, exists.
     * @param {String} key - uid of the field
     * @example
     * let blogQuery = Stack.contentType('example').entries()
     * let data = blogQuery.exists('featured').find()
     * data.then((result) => {
     *   // ‘result’ contains the list of entries in which "featured" exists.
     * }).catch((error) => {
     *   // error trace
     * })
     * @returns {this} - Returns `stack's` instance
     */
    this.exists = extend.exists(true)

    /**
     * @public
     * @method notExists
     * @description Retrieve entries if value of the field, mentioned in the condition, does not exists.
     * @param {String} key - uid of the field
     * @example
     * let blogQuery = Stack.contentType('example').entries()
     * let data = blogQuery.notExists('featured').find()
     * data.then((result) => {
     *   // result is the list of non-existing’featured’" data.
     * }).catch((error) => {
     *   // error trace
     * })
     * @returns {this} - Returns `stack's` instance
     */
    this.notExists = extend.exists(false)

    /**
     * @public
     * @method ascending
     * @description Sort fetched entries in the ascending order with respect to a specific field.
     * @param {String} key - field uid based on which the ordering will be done
     * @example
     * let blogQuery = Stack.contentType('example').entries()
     * let data = blogQuery.ascending('created_at').find()
     * data.then((result) => {
     *   // ‘result’ contains the list of entries which is sorted in
     *   //ascending order on the basis of ‘created_at’.
     * }).catch((error) => {
     *   // error trace
     * })
     * @returns {this} - Returns `stack's` instance
     */
    this.ascending = extend.sort('asc')

    /**
     * @public
     * @method descending
     * @description Sort fetched entries in the descending order with respect to a specific field
     * @param {String} key - field uid based on which the ordering will be done.
     * @example
     * let blogQuery = Stack.contentType('example').entries()
     * let data = blogQuery.descending('created_at').find()
     * data.then((result) => {
     *   // ‘result’ contains the list of entries which is sorted in
     *   //descending order on the basis of ‘created_at’.
     * }).catch((error) => {
     *   // error trace
     * })
     * @returns {this} - Returns `stack's` instance
     */
    this.descending = extend.sort('desc')


    /**
     * @public
     * @method skip
     * @description Skips at specific number of entries.
     * @param {Number} skip - number of entries to be skipped
     * @example
     * let blogQuery = Stack.contentType('example').entries()
     * let data = blogQuery.skip(5).find()
     * data.then((result) => {
     *   //result
     * }).catch((error) => {
     *   // error trace
     * })
     * @returns {this} - Returns `stack's` instance
     */
    this.skip = extend.pagination('skip')

    /**
     * @public
     * @method limit
     * @description Returns a specific number of entries based on the set limit
     * @param {Number} limit - maximum number of entries to be returned
     * @example
     * let blogQuery = Stack.contentType('example').entries()
     * let data = blogQuery.limit(10).find()
     * data.then((result) => {
     *   // result contains the limited number of entries
     * }).catch((error) => {
     *   // error trace
     * })
     * @returns {this} - Returns `stack's` instance
     */
    this.limit = extend.pagination('limit')

    /**
     * @public
     * @method or
     * @description Retrieves entries that satisfy at least one of the given conditions
     * @param {object} queries - array of Query objects or raw queries
     * @example
     * let Query1 = Stack.contentType('example').entries().equalTo('title', 'Demo').find()
     * let Query2 = Stack.contentType('example').entries().lessThan('comments', 10).find()
     * blogQuery.or(Query1, Query2).find()
     * @returns {this} - Returns `stack's` instance
     */
    this.or = extend.logical('$or')
    this.nor = extend.logical('$nor')
    this.not = extend.logical('$not')

    /**
     * @public
     * @method and
     * @description Retrieve entries that satisfy all the provided conditions.
     * @param {object} queries - array of query objects or raw queries.
     * @example
     * let Query1 = Stack.contentType('example').entries().equalTo('title', 'Demo')
     * let Query2 = Stack.contentType('example').entries().lessThan('comments', 10)
     * blogQuery.and(Query1, Query2).find()
     * @returns {this} - Returns `stack's` instance
     */
    this.and = extend.logical('$and')
  }

  /**
   * TODO
   * @public
   * @method connect
   * @summary
   *  Establish connection to filesytem
   * @param {Object} overrides - Config overrides/flesystem specific config
   * @example
   * Stack.connect({overrides})
   *  .then((result) => {
   *    // db instance
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   *
   * @returns {string} baseDir
   */
  public connect(overrides: any = {}) {
    this.config = merge(this.config, overrides)

    return Promise.resolve(this.config)
  }

  /**
   * @public
   * @method contentType
   * @summary
   *  Content type to query on
   * @param {String} uid - Content type uid
   * @returns {this} - Returns `stack's` instance
   * @example
   * Stack.contentType('example').entries().find()
   *  .then((result) => {
   *    // returns entries filtered based on 'example' content type
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   *
   * @returns {Stack} instance
   */
  public contentType(uid) {
    if (typeof uid !== 'string' || uid.length === 0) {
      throw new Error('Kindly provide a uid for .contentType()')
    }
    const stack = new Stack(this.config)
    stack.q.content_type_uid = uid

    return stack
  }

  /**
   * @public
   * @method entries
   * @summary
   * To get entries from contentType
   * @example
   * Stack.contentType('example')
   *  .entries()
   *  .find()
   * @returns {this} - Returns `stack's` instance
   */
  public entries() {
    if (typeof this.q.content_type_uid === 'undefined') {
      throw new Error('Please call .contentType() before calling .entries()!')
    }

    return this
  }

  /**
   * @public
   * @method entry
   * @summary
   * To get entry from contentType
   * @example
   * Stack.contentType('example').entry('bltabcd12345').find()
   * //or
   * Stack.contentType('example').entry().find()
   * @param {string} uid- Optional. uid of entry
   * @returns {this} - Returns `stack's` instance
   */
  public entry(uid ? ) {
    this.q.isSingle = true
    if (typeof this.q.content_type_uid === 'undefined') {
      throw new Error('Please call .contentType() before calling .entries()!')
    }

    if (uid && typeof uid === 'string') {
      this.q.query.uid = uid
    }

    return this
  }

  /**
   * @public
   * @method asset
   * @summary
   * To get single asset
   * @example
   * Stack.asset('bltabced12435').find()
   * //or
   * Stack.asset().find()
   * @param {string} uid- Optional. uid of asset
   * @returns {this} - Returns `stack's` instance
   */
  public asset(uid ? ) {
    const stack = new Stack(this.config)
    stack.q.isSingle = true
    stack.q.content_type_uid = stack.types.assets
    if (uid && typeof uid === 'string') {
      stack.q.query.uid = uid
    }

    return stack
  }

  /**
   * @public
   * @method assets
   * @summary Get assets details
   * @example
   * Stack.assets().find()
   *
   * @returns {this} - Returns `stack's` instance
   */
  public assets() {
    const stack = new Stack(this.config)
    stack.q.content_type_uid = stack.types.assets

    return stack
  }


  /**
   * @public
   * @method schemas
   * @summary Get content type schemas
   * @example
   * Stack.schemas().find()
   *
   * @returns {this} - Returns `stack's` instance
   */
  public schemas() {
    const stack = new Stack(this.config)
    stack.q.content_type_uid = stack.types.content_types

    return stack
  }

  /**
   * @public
   * @method contentTypes
   * @summary Get content type schemas
   * @example
   * Stack.contentTypes().find()
   *
   * @returns {this} - Returns `stack's` instance
   */
  public contentTypes() {
    const stack = new Stack(this.config)
    stack.q.content_type_uid = stack.types.content_types

    return stack
  }

  /**
   * @public
   * @method schema
   * @summary Get a single content type's schema
   * @param {String} uid - Optional 'uid' of the content type, who's schema is to be fetched
   * @example
   * Stack.schema(uid?: string).find()
   *
   * @returns {this} - Returns `stack's` instance
   */
  public schema(uid?: string) {
    const stack = new Stack(this.config)
    stack.q.isSingle = true
    stack.q.content_type_uid = stack.types.content_types
    if (uid && typeof uid === 'string') {
      stack.q.query.uid = uid
    }

    return stack
  }


  /**
   * @public
   * @method equalTo
   * @description Retrieve entries in which a specific field satisfies the value provided
   * @param {String} key - uid of the field
   * @param {Any} value - value used to match or compare
   * @example
   * let blogQuery = Stack.contentType('example').entries()
   * let data = blogQuery.equalTo('title','Demo').find()
   * data.then((result) => {
   *   // ‘result’ contains the list of entries where value of
   *   //‘title’ is equal to ‘Demo’.
   * }).catch((error) => {
   *   // error trace
   * })
   *
   * @returns {this} - Returns `stack's` instance
   */
  public equalTo(key, value) {
    if (!key || typeof key !== 'string' && typeof value === 'undefined') {
      throw new Error('Kindly provide valid parameters for .equalTo()!')
    }
    this.q.query[key] = value

    return this
  }

  /**
   * @public
   * @method where
   * @summary Pass JS expression or a full function to the query system
   * @description Evaluate js expressions
   * @param field
   * @param value
   *
   * @example
   * const query = Stack.contentType('example').entries().where("this.title === 'Amazon_Echo_Black'").find()
   * query.then((result) => {
   *   // ‘result’ contains the list of entries where value of
   *   //‘title’ is equal to ‘Demo’.
   * }).catch(error) => {
   *   // error trace
   * })
   *
   * @returns {this} - Returns `stack's` instance
   */
  public where(expr) {
    if (!expr) {
      throw new Error('Kindly provide a valid field and expr/fn value for \'.where()\'')
    }
    this.q.query.$where = expr

    return this
  }

  /**
   * @public
   * @method count
   * @description Returns the total number of entries
   * @example
   * const query = Stack.contentType('example').entries().count().find()
   * query.then((result) => {
   *   // returns 'example' content type's entries
   * }).catch(error) => {
   *   // error trace
   * })
   * @returns {this} - Returns `stack's` instance
   */
  public count() {
    this.q.countOnly = 'count'

    return this.find()
  }

  /**
   * @public
   * @method query
   * @description Retrieve entries based on raw queries
   * @param {object} userQuery - RAW (JSON) queries
   * @returns {this} - Returns `stack's` instance
   * @example
   * Stack.contentType('example').entries().query({"authors.name": "John Doe"}).find()
   *  .then((result) => {
   *    // returns entries, who's reference author's name equals "John Doe"
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   */
  public query(userQuery) {
    if (!userQuery || typeof userQuery !== 'object') {
      throw new Error('Kindly provide valid parameters for \'.query()\'')
    }
    this.q.query = merge(this.q.query, userQuery)

    return this
  }

  /**
   * @public
   * @method tags
   * @description Retrieves entries based on the provided tags
   * @param {Array} values - Entries/Assets that have the specified tags
   * @example
   * const query = Stack.contentType('example').entries().tags(['technology', 'business']).find()
   * query.then((result) => {
   *   // ‘result’ contains list of entries which have tags "’technology’" and ‘"business’".
   * }).catch((error) => {
   *   // error trace
   * })
   * @returns {this} - Returns `stack's` instance
   */
  public tags(values) {
    if (values && typeof values === 'object' && values instanceof Array) {
      if (values.length === 0) {
        this.q.query.tags = {
          $size: 0,
        }
      } else {
        this.q.query.tags = {
          $in: values,
        }
      }

      return this
    }
    throw new Error('Kindly provide valid parameters for \'.tags()\'')
  }

  /**
   * @public
   * @method includeCount
   * @description Includes the total number of entries returned in the response.
   * @example
   * Stack.contentType('example')
   *  .entries()
   *  .includeCount()
   *  .find()
   * @returns {this} - Returns `stack's` instance
   */
  public includeCount() {
    this.q.includeCount = true

    return this
  }

  /**
   * @public
   * @method language
   * @description to retrive the result bsed on the specific locale.
   * @param {String} languageCode - Language to query on
   * @example
   * Stack.contentType('example')
   *  .entries()
   *  .language('fr-fr')
   *  .find()
   *
   * @returns {this} - Returns `stack's` instance
   */
  public language(languageCode) {
    if (!languageCode || typeof languageCode !== 'string') {
      throw new Error(`${languageCode} should be of type string and non-empty!`)
    }
    this.q.locale = languageCode

    return this
  }

  /**
   * @public
   * @method include
   * @summary
   * Includes references of provided fields of the entries being scanned
   * @param {*} key - uid/uid's of the field
   *
   * @example
   * Stack.contentType('example')
   *  .entries()
   *  .include(['authors','categories'])
   *  .find()
   *
   * // Overlapping paths are automatically chained:
   * // .include(['content', 'content.nested']) becomes equivalent to:
   * // .include(['content']).include(['content.nested'])
   *
   * @returns {this} - Returns `stack's` instance
   */
  public include(fields) {
    // Normalize input to array
    let fieldsArray: string[]
    if (typeof fields === 'string') {
      fieldsArray = [fields]
    } else if (fields && Array.isArray(fields) && fields.length) {
      fieldsArray = [...fields] // Create a copy to avoid mutation
    } else {
      throw new Error('Kindly pass \'string\' OR \'array\' fields for .include()!')
    }

    // If only one field, use original behavior
    if (fieldsArray.length === 1) {
      this.q.includeSpecificReferences = fieldsArray
      return this
    }

    // Analyze paths for overlaps and dependencies
    const pathAnalysis = this.analyzeReferencePaths(fieldsArray)
    
    if (pathAnalysis.hasOverlaps) {
      // Process paths with overlaps using chained approach
      return this.processOverlappingPaths(pathAnalysis)
    } else {
      // No overlaps, use original behavior
      this.q.includeSpecificReferences = fieldsArray
      return this
    }
  }

  /**
   * @public
   * @method includeReferences
   * @summary
   *  Includes all references of the entries being scanned
   * @param {number} depth - Optional parameter. Use this to override the default reference depth/level i.e. 4
   *
   * @example
   * Stack.contentType('example')
   *  .entries()
   *  .includeReferences()
   *  .find()
   *
   * @returns {this} - Returns `stack's` instance
   */
  public includeReferences(depth?: number) {
    console.warn(WARNING_MESSAGES.INCLUDE_REFERENCES_SLOW())
    this.q.includeAllReferences = true
    if (typeof depth === 'number') {
      this.q.referenceDepth = depth
    }

    return this
  }

  /**
   * @public
   * @method excludeReferences
   * @summary
   *  Excludes all references of the entries being scanned
   *
   * @example
   * Stack.contentType('example')
   *  .entries()
   *  .excludeReferences()
   *  .find()
   *  .then((result) => {
   *    // ‘result’ entries without references
   *  }).catch((error) => {
   *    // error trace
   *  })
   *
   * @returns {this} - Returns `stack's` instance
   */
  public excludeReferences() {
    this.q.excludeAllReferences = true

    return this
  }

  /**
   * @public
   * @method includeContentType
   * @description Includes the total number of entries returned in the response.
   * @example
   * Stack.contentType('example')
   *  .entries()
   *  .includeContentType()
   *  .find()
   *  .then((result) => {
   *    // Expected result
   *    {
   *      entries: [
   *        {
   *          ...,
   *        },
   *      ],
   *      content_type_uid: 'example',
   *      locale: 'en-us',
   *      content_type: {
   *        ..., // Content type example's schema
   *      }
   *    }
   *  }).catch((error) => {
   *    // error trace
   *  })
   *
   * @returns {this} - Returns `stack's` instance
   */
  public includeContentType() {
    this.q.include_content_type = true

    return this
  }


  /**
   * @public
   * @method getQuery
   * @description Returns the raw (JSON) query based on the filters applied on Query object.
   * @example
   * Stack.contentType('example')
   *  .eqaulTo('title','Demo')
   *  .getQuery()
   *  .find()
   *
   * @returns {this} - Returns `stack's` instance
   */
  public getQuery() {
    return this.q.query
  }

  /**
   * @public
   * @method regex
   * @description Retrieve entries that match the provided regular expressions
   * @param {String} key - uid of the field
   * @param {*} value - value used to match or compare
   * @param {String} [options] - match or compare value in entry
   * @example
   * let blogQuery = Stack.contentType('example').entries()
   * blogQuery.regex('title','^Demo').find() //regex without options
   * //or
   * blogQuery.regex('title','^Demo', 'i').find() //regex without options
   * @returns {this} - Returns `stack's` instance
   */
  public regex(key, value, options = 'g') {
    if (key && value && typeof key === 'string' && typeof value === 'string') {
      this.q.query[key] = {
        $options: options,
        $regex: value,
      }

      return this
    }

    throw new Error('Kindly provide valid parameters for .regex()!')
  }

  /**
   * @public
   * @method only
   * @description
   *  Similar to MongoDB projections. Accepts an array.
   *  Only fields mentioned in the array would be returned in the result.
   * @param {Array} result - Array of field properties
   * @example
   * const query = Stack.contentType('example').entries().only(['title','uid']).find()
   * query.then((result) => {
   *   // ‘result’ contains a list of entries with field title and uid only
   * }).catch((error) => {
   *   // error trace
   * })
   *
   * @returns {this} - Returns `stack's` instance
   */
  public only(fields) {
    if (fields && typeof fields === 'object' && fields instanceof Array && fields.length) {
      this.q.only = fields

      return this
    }

    throw new Error('Kindly provide valid parameters for .only()!')
  }

  /**
   * @public
   * @method except
   * @description
   *  Similar to MongoDB projections. Accepts an array.
   *  Only fields mentioned in the array would be removed from the result.
   * @param {Array} result - Array of field properties
   * @example
   * const query = Stack.contentType('example').entries().except(['title','uid']).find()
   * query.then((result) => {
   *   // ‘result’ contains a list of entries with field title and uid only
   * }).catch((error) => {
   *   // error trace
   * })
   *
   * @returns {this} - Returns `stack's` instance
   */
  public except(fields) {
    if (fields && typeof fields === 'object' && fields instanceof Array && fields.length) {
      this.q.except = []
      const keys = Object.keys(this.contentStore.projections).filter(key => this.contentStore.projections[key] === 0)
      this.q.except = keys.concat(fields)

      return this
    }

    throw new Error('Kindly provide valid parameters for .except()!')
  }

  /**
   * @public
   * @method queryReferences
   * @summary
   *  Wrapper, that allows querying on the entry's references.
   * @note
   *  This is a slow method, since it scans all documents and fires the `reference` query on them
   *  Use `.query()` filters to reduce the total no of documents being scanned
   * @param {Any} query - Query filter, to be applied on referenced result
   * @example
   * Stack.contentType('blog')
   *  .entries()
   *  .includeRferences() // This would include all references of the content type
   *  .queryReferences({"authors.name": "John Doe"})
   *  .find()
   *
   * @returns {this} - Returns `stack's` instance
   */
  public queryReferences(query) {
    if (!query || typeof query !== 'object') {
      throw new Error('Kindly valid parameters for \'.queryReferences()\'!')
    }
    this.q.queryOnReferences = query

    return this
  }

  /**
   * @public
   * @method referenceDepth
   * @deprecated
   * @summary
   * Use it along with .includeReferences()
   * Overrides the default reference depths defined for references - 2
   * i.e. If A -> B -> C -> D, so calling .includeReferences() on content type A,
   * would result in all references being resolved until its nested child reference D
   * @param {number} depth - Level of nested references to be fetched
   * @example
   * Stack.contentType('blog')
   *  .entries()
   *  .includeReferences()
   *  .referenceDepth(4)
   *  .find()
   *
   * @returns {this} - Returns the `stack's` instance
   */
  public referenceDepth(depth) {
    if (typeof depth !== 'number') {
      throw new Error('Kindly valid parameters for \'.referenceDepth()\'!')
    }
    this.q.referenceDepth = depth

    if (depth > this.contentStore.referenceDepth) {
      console.warn(WARNING_MESSAGES.REFERENCE_DEPTH_PERFORMANCE(this.contentStore.referenceDepth))
    }

    return this
  }

  /**
   * @public
   * @method find
   * @description
   * Queries the db using the query built/passed
   * Does all the processing, filtering, referencing after querying the DB
   * @param {object} query Optional query object, that overrides all the
   * previously build queries
   * @public
   * @example
   * Stack.contentType('blog').entries().find()
   * .then((result) => {
   *    // returns blog content type's entries
   * })
   * .catch((error) => {
   *    // handle query errors
   * })
   * @returns {object} - Returns a objects, that have been processed, filtered and referenced
   */
  public find() {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          filePath,
          key,
          locale,
        } = this.preProcess()
        let data: any[] = await readFile(filePath)
        const count = data.length
        data = data.filter(sift(this.q.query))

        if (data.length === 0 || this.q.content_type_uid === this.types.content_types || this.q.content_type_uid ===
          this.types.assets || this.q.countOnly || this.q.excludeAllReferences) {
          // do nothing
        } else if (this.q.includeSpecificReferences) {
          await this
            .includeSpecificReferences(data, this.q.content_type_uid, locale, this.q
              .includeSpecificReferences)
        } else if (this.q.includeAllReferences) {
          // need re-writes
          await this.bindReferences(data, this.q.content_type_uid, locale)
        } else {

          await this.includeAssetsOnly(data, locale, this.q.content_type_uid)
        }

        if (this.q.queryOnReferences) {
          data = data.filter(sift(this.q.queryOnReferences))
        }

        const { output } = await this.postProcess(data, key, locale, count)

        return resolve(output)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @public
   * @method findOne
   * @deprecated - Use .fetch() instead
   * @description
   * Queries the db using the query built/passed. Returns a single entry/asset/content type object
   * Does all the processing, filtering, referencing after querying the DB
   * @param {object} query Optional query object, that overrides all the previously build queries
   *
   * @example
   * Stack.contentType('blog')
   *  .entries()
   *  .findOne()
   *
   * @returns {object} - Returns an object, that has been processed, filtered and referenced
   */
  public findOne() {
    this.q.isSingle = true

    return this.find()
  }

  /**
   * @public
   * @method fetch
   * @description
   * Queries the db using the query built/passed. Returns a single entry/asset/content type object
   * Does all the processing, filtering, referencing after querying the DB
   * @param {object} query Optional query object, that overrides all the previously build queries
   *
   * @example
   * Stack.contentType('blog')
   *  .entries()
   *  .fetch()
   *
   * @returns {object} - Returns an object, that has been processed, filtered and referenced
   */
  public fetch() {
    this.q.isSingle = true

    return this.find()
  }

  /**
   * @private
   * @method analyzeReferencePaths
   * @description Analyzes reference paths to detect overlaps and dependencies
   * @param {Array} paths - Array of reference paths
   * @returns {Object} Analysis result
   */
  private analyzeReferencePaths(paths: string[]) {
    const analysis = {
      hasOverlaps: false,
      independentPaths: [] as string[],
      overlappingGroups: [] as string[][],
      allPaths: paths
    }

    // Sort paths by length to process shorter paths first
    const sortedPaths = [...paths].sort((a, b) => a.length - b.length)
    const processed = new Set<string>()

    for (let i = 0; i < sortedPaths.length; i++) {
      const currentPath = sortedPaths[i]
      
      if (processed.has(currentPath)) {
        continue
      }

      // Find all paths that start with currentPath
      const relatedPaths = sortedPaths.filter(path => 
        path.startsWith(currentPath) && 
        (path === currentPath || path[currentPath.length] === '.')
      )

      if (relatedPaths.length > 1) {
        // Found overlapping paths
        analysis.hasOverlaps = true
        analysis.overlappingGroups.push(relatedPaths)
        relatedPaths.forEach(path => processed.add(path))
      } else {
        // Independent path
        analysis.independentPaths.push(currentPath)
        processed.add(currentPath)
      }
    }

    return analysis
  }

  /**
   * @private
   * @method processOverlappingPaths
   * @description Processes overlapping paths using a chained approach
   * @param {Object} pathAnalysis - Analysis result from analyzeReferencePaths
   * @returns {this} - Returns stack instance
   */
  private processOverlappingPaths(pathAnalysis: any): Stack {
    // Collect ALL paths first
    const allPaths: string[] = []
    
    // Add independent paths
    if (pathAnalysis.independentPaths.length > 0) {
      allPaths.push(...pathAnalysis.independentPaths)
    }

    // Add all paths from overlapping groups
    pathAnalysis.overlappingGroups.forEach((group: string[]) => {
      allPaths.push(...group)
    })

    // Remove exact duplicates
    const uniquePaths = [...new Set(allPaths)]
    
    // Smart filtering: remove parent paths that are fully covered by child paths
    const filteredPaths = this.removeRedundantPaths(uniquePaths)
    
    this.q.includeSpecificReferences = filteredPaths
    return this
  }

  /**
   * @private
   * @method removeRedundantPaths
   * @description Removes parent paths that are fully covered by more specific child paths
   * Example: ["content", "content.content"] → ["content.content"]
   * But keeps: ["form", "form.fields", "form.fields.rules"] → all three (not redundant)
   */
  private removeRedundantPaths(paths: string[]): string[] {
    // Sort by length (longest first) to prioritize more specific paths
    const sortedPaths = paths.sort((a, b) => b.length - a.length)
    const result: string[] = []
    
    for (const currentPath of sortedPaths) {
      // Check if this path is made redundant by a more specific path already in result
      const isRedundant = result.some(existingPath => {
        // Check if currentPath is a direct parent of existingPath
        return existingPath.startsWith(currentPath + '.') && 
               existingPath.split('.').length === currentPath.split('.').length + 1
      })
      
      if (!isRedundant) {
        result.push(currentPath)
      }
    }
    
    return result
  }
  

  /**
   * @private
   * @method preProcess
   * @description
   * Runs before .find()
   * Formats the queries/sets defaults and returns the locale, key & filepath of the data
   * @returns {object} - Returns the query's key, locale & filepath of the data
   */
  private preProcess() {
    const locale = (typeof this.q.locale === 'string') ? this.q.locale : this.contentStore.locale
    let key: string
    let filePath: string
    switch (this.q.content_type_uid) {
      case this.types.assets:
        filePath = getAssetsPath(locale) + '.json'
        key = (this.q.isSingle) ? 'asset' : 'assets'
        break
      case this.types.content_types:
        filePath = getContentTypesPath(locale) + '.json'
        key = (this.q.isSingle) ? 'content_type' : 'content_types'
        break
      default:
        filePath = getEntriesPath(locale, this.q.content_type_uid) + '.json'
        key = (this.q.isSingle) ? 'entry' : 'entries'
        break
    }

    if (!existsSync(filePath)) {
      throw new Error(`Queried content type ${this.q.content_type_uid} was not found at ${filePath}!`)
    }

    if (!this.q.hasOwnProperty('asc') && !this.q.hasOwnProperty('desc')) {
      this.q.desc = this.contentStore.defaultSortingField
    }

    if (!this.q.hasOwnProperty('except') && !this.q.hasOwnProperty('only')) {
      const keys = Object.keys(this.contentStore.projections).filter(key => this.contentStore.projections[key] === 0)
      this.q.except = keys
    }

    this.q.referenceDepth = (typeof this.q.referenceDepth === 'number') ? this.q.referenceDepth : this.contentStore
      .referenceDepth

    return {
      filePath,
      key,
      locale,
    }
  }

  /**
   * @private
   * @method postProcess
   * @description
   * Runs after .find()
   * Formats the data as per query
   * @param {object} data - The result data
   * @param {string} key - The key to whom the data is to be assigned
   * @param {string} locale - The query's locale
   * @returns {object} - Returns the formatted input
   */
  private async postProcess(data, key, locale, count?: number) {
    // tslint:disable-next-line: variable-name
    const content_type_uid = (this.q.content_type_uid === this.types.assets) ? 'assets' : (this.q.content_type_uid ===
      this.types.content_types ? 'content_types' : this.q.content_type_uid)
    const output: any = {
      content_type_uid,
      locale,
    }
    if (this.q.countOnly) {
      output.count = data.length

      return { output }
    }

    if (this.q.include_content_type) {
      // ideally, if the content type doesn't exist, an error will be thrown before it reaches this line
      const contentTypes: any[] = await readFile(getContentTypesPath(locale) + '.json')

      for (let i = 0, j = contentTypes.length; i < j; i++) {
        if (contentTypes[i].uid === this.q.content_type_uid) {
          output.content_type = contentTypes[i]
          break
        }
      }
    }

    if (this.q.includeCount) {
      output.count = count
    }

    if (this.q.isSingle) {
      data = (data.length) ? data[0] : null
      if (this.q.only) {
        const only = this.q.only.toString().replace(/\./g, '/')
        data = mask(data, only)
      } else if (this.q.except) {
        const bukcet = this.q.except.toString().replace(/\./g, '/')
        const except = mask(data, bukcet)
        data = difference(data, except)
      }
      output[key] = /* (data.length) ? data[0] : null */ data

      return { output }
    }

    // TODO: sorting logic
    // Experimental!
    if (this.q.hasOwnProperty('asc')) {
      data = sortBy(data, this.q.asc)
    } else if (this.q.hasOwnProperty('desc')) {
      const temp = sortBy(data, this.q.desc)
      data = reverse(temp)
    }

    if (this.q.skip) {
      data.splice(0, this.q.skip)
    }

    if (this.q.limit) {
      data = data.splice(0, this.q.limit)
    }

    if (this.q.only) {
      const only = this.q.only.toString().replace(/\./g, '/')
      data = mask(data, only)
    } else if (this.q.except.length) {
      const bukcet = this.q.except.toString().replace(/\./g, '/')
      const except = mask(data, bukcet)
      data = difference(data, except)
    }

    output[key] = data

    return { output }
  }

  private async includeSpecificReferences(entries: any[], contentTypeUid: string, locale: string, include: string[]) {
    const ctQuery = {
      _content_type_uid: this.types.content_types,
      uid: contentTypeUid,
    }

    const {
      paths, // ref. fields in the current content types
      pendingPath, // left over of *paths*
      schemaList, // list of content type uids, the current content types refer to
    } = await this.getReferencePath(ctQuery, locale, include)

    const queries = {
      $or: [],
    } // reference field paths
    const shelf = [] // a mapper object, that holds pointer to the original element

    // iterate over each path in the entries and fetch the references
    // while fetching, keep track of their location
    for (let i = 0, j = paths.length; i < j; i++) {
   // populates shelf and queries
      this.fetchPathDetails(entries, locale, paths[i].split('.'), queries, shelf, true, entries, 0)
    }

    // even after traversing, if no references were found, simply return the entries found thusfar
    if (shelf.length === 0) {
      return
    }

    // else, self-recursively iterate and fetch references
    // Note: Shelf is the one holding `pointers` to the actual entry
    // Once the pointer has been used, for GC, point the object to null
    await this.includeReferenceIteration(queries, schemaList, locale, pendingPath, shelf)

    return
  }

  private async includeReferenceIteration(eQuery: any, ctQuery: any, locale: string, include: string[], oldShelf: IShelf[]) {
    if (oldShelf.length === 0) {
      return
    } else if (ctQuery.$or.length === 0 && eQuery.$or.length > 0) {
      await this.bindLeftoverAssets(eQuery, locale, oldShelf)

      return
    }

    const {
      paths,
      pendingPath,
      schemaList,
    } = await this.getReferencePath(ctQuery, locale, include)

    const queries = {
      $or: [],
    }
    let result = {
      docs: [],
    }
    const shelf = []
    await this.subIncludeReferenceIteration(eQuery, locale, paths, include, queries, result, shelf)

    // GC to avoid mem leaks!
    eQuery = null

    for (let i = oldShelf.length - 1, j = 0; i >= j; i--) {
      const element: IShelf = oldShelf[i]
      let flag = true
      for (let k = 0, l = result.docs.length; k < l; k++) {
        if (result.docs[k].uid === element.uid) {
          element.path[element.position] = result.docs[k]
          flag = false
          break
        }
      }

      if (flag) {
        for (let e = 0, f = oldShelf[i].path.length; e < f; e++) {
          // tslint:disable-next-line: max-line-length
          if (
            oldShelf[i].path[e]?.hasOwnProperty("_content_type_uid") &&
            Object.keys(oldShelf[i].path[e]).length === 2
          ) {
            (oldShelf[i].path as any).splice(e, 1);
            break;
          }
        }
      }
    }

    // GC to avoid mem leaks!
    oldShelf = null
    result = null

    // Iterative loops, that traverses paths and binds them onto entries
    await this.includeReferenceIteration(queries, schemaList, locale, pendingPath, shelf)

    return
  }

  private async subIncludeReferenceIteration(eQuieries, locale, paths, include, queries, result, shelf) {
    const {
      contentTypes,
      aggQueries,
    } = segregateQueries(eQuieries.$or)
    const promises = []

    contentTypes.forEach((contentType) => {
      promises.push(this.fetchDocuments(aggQueries[contentType], locale, contentType, paths, include, queries,
        result,
        shelf))
    })

    // wait for all promises to be resolved
    await Promise.all(promises)

    return {
      queries,
      result,
      shelf,
    }
  }

  private async getReferencePath(query, locale, currentInclude) {
    const data: any[] = await readFile(getContentTypesPath(locale) + '.json')
    const schemas: any[] = data.filter(sift(query))
    const pendingPath: string[] = []
    const schemasReferred = []
    const paths: string[] = []
    const schemaList = {
      $or: [],
    }

    if (schemas.length === 0) {
      return {
        paths,
        pendingPath,
        schemaList,
      }
    }

    let entryReferences = {}

    schemas.forEach((schema) => {
      // Entry references
      entryReferences = mergeWith(entryReferences, schema[this.types.references], (existingReferences, newReferences) => {
        if (isArray(existingReferences)) { 
          return Array.from(new Set(existingReferences.concat(newReferences))); 
        }
        return existingReferences;
      });
      // tslint:disable-next-line: forin
      for (const path in schema[this.types.assets]) {
        paths.push(path)
      }
    })

    for (let i = 0, j = currentInclude.length; i < j; i++) {
      const includePath = currentInclude[i]
      // tslint:disable-next-line: forin
      for (const path in entryReferences) {
        if (path.length > includePath.length) {
          continue;
        }
        const subStr = includePath.slice(0, path.length);
        if (subStr === path && (includePath[path.length] === '.' || includePath === subStr)) {
          let subPath
          // Its the complete path!! Hurrah!
          if (path.length !== includePath.length) {
            subPath = subStr
            pendingPath.push(includePath.slice(path.length + 1))
          } else {
            subPath = includePath
          }

          if (typeof entryReferences[path] === 'string') {
            schemasReferred.push({
              _content_type_uid: this.types.content_types,
              uid: entryReferences[path],
            })
          } else if (entryReferences[path].length) {
            entryReferences[path].forEach((contentTypeUid) => {
              schemasReferred.push({
                _content_type_uid: this.types.content_types,
                uid: contentTypeUid,
              })
            })
          }

          paths.push(subPath)
          break
        }
      }
    }

    schemaList.$or = schemasReferred

    return {
      // path, that's possible in the current schema
      paths,
      // paths, that's yet to be traversed
      pendingPath,
      // schemas, to be loaded!
      schemaList,
    }
  }

  /**
  * @private
  * @method addToShelfIfNotExists
  * @description Helper function to add entry to shelf only if it doesn't already exist
  * @param {IShelf[]} shelf - The shelf array to add to
  * @param {any} path - The path reference
  * @param {number} position - The position in the path
  * @param {string} uid - The unique identifier
  */
  private addToShelfIfNotExists(shelf: IShelf[], path, position, uid) {
    const exists = shelf.some(entry =>
      entry.path === path &&
      entry.position === position &&
      entry.uid === uid
    );
    if (!exists) {
      shelf.push({ path, position, uid });
    }
  }

  // tslint:disable-next-line: max-line-length
  private fetchPathDetails(data: any, locale: string, pathArr: string[], queryBucket: IQuery, shelf, assetsOnly = false, parent, pos, counter = 0) {
    if (counter === (pathArr.length)) {
      if (data && typeof data === 'object') {
        if (data instanceof Array && data.length) {
          data.forEach((elem, idx) => {
            if (typeof elem === 'string') {
              queryBucket.$or.push({
                _content_type_uid: this.types.assets,
                _version: { $exists: true },
                locale,
                uid: elem,
              })

              this.addToShelfIfNotExists(shelf, data, idx, elem);
            } else if (elem && typeof elem === 'object' && elem.hasOwnProperty('_content_type_uid')) {
              queryBucket.$or.push({
                _content_type_uid: elem._content_type_uid,
                locale,
                uid: elem.uid,
              })

              this.addToShelfIfNotExists(shelf, data, idx, elem.uid);
            }
          })
        } else if (typeof data === 'object') {
          if (data.hasOwnProperty('_content_type_uid')) {
            queryBucket.$or.push({
              _content_type_uid: data._content_type_uid,
              locale,
              uid: data.uid,
            })

            this.addToShelfIfNotExists(shelf, parent, pos, data.uid);
          }
        }
      } else if (typeof data === 'string') {
        queryBucket.$or.push({
          _content_type_uid: this.types.assets,
          _version: { $exists: true },
          locale,
          uid: data,
        })

        this.addToShelfIfNotExists(shelf, parent, pos, data);
      }
    } else {
      const currentField = pathArr[counter]
      counter++
      if (data instanceof Array) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < data.length; i++) {
          if (data[i][currentField]) {
            this.fetchPathDetails(data[i][currentField], locale, pathArr, queryBucket, shelf, assetsOnly, data[i],
              currentField, counter)
          }
        }
      } else {
        if (data[currentField]) {
          this.fetchPathDetails(data[currentField], locale, pathArr, queryBucket, shelf, assetsOnly, data,
            currentField, counter)
        }
      }
    }

    // since we've reached last of the paths, return!
    return
  }

  // tslint:disable-next-line: max-line-length
  private async fetchDocuments(query: any, locale: string, contentTypeUid: string, paths: string[], include: string[], queries: IQuery, result: any, bookRack: IShelf, includeAll: boolean = false) {
    let contents: any[]
    if (contentTypeUid === this.types.assets) {
      contents = await readFile(getAssetsPath(locale) + '.json')
    } else {
      contents = await readFile(getEntriesPath(locale, contentTypeUid) + '.json')
    }

    result.docs = result.docs.concat(contents.filter(sift(query)))

    result.docs.forEach((doc) => {
      this.projections.forEach((key) => {
        if (doc?.hasOwnProperty(key) && this.contentStore.projections[key] === 0) {
          delete doc[key]
        }
      })
    })

    if (result.length === 0) {
      return
    }

    if (include.length || includeAll) {
      paths.forEach((path) => {
        this.fetchPathDetails(result.docs, locale, path.split('.'), queries, bookRack, false, result, 0)
      })
    } else {
      // if there are no includes, only fetch assets
      paths.forEach((path) => {
        this.fetchPathDetails(result.docs, locale, path.split('.'), queries, bookRack, true, result, 0)
      })
    }

    return
  }

  private async includeAssetsOnly(entries: any[], locale: string, contentTypeUid: string) {
    const schemas = await readFile(getContentTypesPath(locale) + '.json')
    let schema
    for (let i = 0, j = schemas.length; i < j; i++) {
      if (schemas[i].uid === contentTypeUid) {
        schema = schemas[i]
        break
      }
    }

    // should not enter this section
    // if the schema doesn't exist, error should have occurred before
    if (typeof schema === 'undefined' || typeof schema[this.types.assets] !== 'object') {
      return
    }

    const paths = Object.keys(schema[this.types.assets])
    const shelf = []
    const queryBucket: any = {
      $or: [],
    }

    for (let i = 0, j = paths.length; i < j; i++) {
      this.fetchPathDetails(entries, locale, paths[i].split('.'), queryBucket, shelf, true, entries, 0)
    }

    if (shelf.length === 0) {
      return
    }

    const assets = await readFile(getAssetsPath(locale) + '.json')
    // might not be required
    const filteredAssets = assets.filter(sift(queryBucket))

    for (let l = 0, m = shelf.length; l < m; l++) {
      for (let n = 0, o = filteredAssets.length; n < o; n++) {
        if (shelf[l].uid === filteredAssets[n].uid) {
          shelf[l].path[shelf[l].position] = filteredAssets[n]
          break
        }
      }
    }

    return
  }

  private async bindReferences(entries: any[], contentTypeUid: string, locale: string) {
    const ctQuery: IQuery = {
      $or: [{
        _content_type_uid: this.types.content_types,
        uid: contentTypeUid,
      }],
    }

    const {
      paths, // ref. fields in the current content types
      ctQueries, // list of content type uids, the current content types refer to
    } = await this.getAllReferencePaths(ctQuery, locale)

    const queries = {
      $or: [],
    } // reference field paths
    const objectPointerList = [] // a mapper object, that holds pointer to the original element

    // iterate over each path in the entries and fetch the references
    // while fetching, keep track of their location
    for (let i = 0, j = paths.length; i < j; i++) {
      this.fetchPathDetails(entries, locale, paths[i].split('.'), queries, objectPointerList, true, entries, 0)
    }

    // even after traversing, if no references were found, simply return the entries found thusfar
    if (objectPointerList.length === 0) {
      return entries
    }
    // else, self-recursively iterate and fetch references
    // Note: Shelf is the one holding `pointers` to the actual entry
    // Once the pointer has been used, for GC, point the object to null

    return this.includeAllReferencesIteration(queries, ctQueries, locale, objectPointerList)
  }

  private async bindLeftoverAssets(queries: IQuery, locale: string, pointerList: IShelf[]) {
    const contents = await readFile(getAssetsPath(locale) + '.json')
    const filteredAssets = contents.filter(sift(queries))

    filteredAssets.forEach((doc) => {
      this.projections.forEach((key) => {
        if (doc?.hasOwnProperty(key) && this.contentStore.projections[key] === 0) {
          delete doc[key]
        }
      })
    })

    for (let l = 0, m = pointerList.length; l < m; l++) {
      for (let n = 0, o = filteredAssets.length; n < o; n++) {
        if (pointerList[l].uid === filteredAssets[n].uid) {
          pointerList[l].path[pointerList[l].position] = filteredAssets[n]
          break
        }
      }
    }

    return
  }

  // tslint:disable-next-line: max-line-length
  private async includeAllReferencesIteration(oldEntryQueries: IQuery, oldCtQueries: IQuery, locale: string, oldObjectPointerList: IShelf[], depth = 0) {
    if (depth > this.q.referenceDepth || oldObjectPointerList.length === 0) {
      return
    } else if (oldCtQueries.$or.length === 0 && oldObjectPointerList.length > 0 && oldEntryQueries.$or.length > 0) {
      // its most likely only assets
      await this.bindLeftoverAssets(oldEntryQueries, locale, oldObjectPointerList)

      return
    }

    const {
      ctQueries,
      paths,
    } = await this.getAllReferencePaths(oldCtQueries, locale)
    // GC to aviod mem leaks
    oldCtQueries = null
    const queries = {
      $or: [],
    }
    let result = {
      docs: [],
    }
    const shelf = []
    await this.subIncludeAllReferencesIteration(oldEntryQueries, locale, paths, queries, result, shelf)
    // GC to avoid mem leaks!
    oldEntryQueries = null

    for (let i = oldObjectPointerList.length - 1, j = 0; i >= j; i--) {
      const element: IShelf = oldObjectPointerList[i]
      let flag = true
      for (let k = 0, l = result.docs.length; k < l; k++) {
        if (result.docs[k].uid === element.uid) {
          element.path[element.position] = result.docs[k]
          flag = false
          break
        }
      }

      if (flag) {
        for (let e = 0, f = oldObjectPointerList[i].path.length; e < f; e++) {
          // tslint:disable-next-line: max-line-length
          if (oldObjectPointerList[i].path[e]?.hasOwnProperty('_content_type_uid') && Object.keys(oldObjectPointerList[i].path[e]).length === 2) {
            (oldObjectPointerList[i].path as any).splice(e, 1)
            break
          }
        }
      }
    }
    // GC to avoid mem leaks!
    oldObjectPointerList = null
    result = null

    ++depth
    // Iterative loops, that traverses paths and binds them onto entries
    await this.includeAllReferencesIteration(queries, ctQueries, locale, shelf, depth)

    return
  }

  private async subIncludeAllReferencesIteration(eQuieries, locale, paths, queries, result, shelf) {
    const {
      contentTypes,
      aggQueries,
    } = segregateQueries(eQuieries.$or)
    const promises = []

    contentTypes.forEach((contentType) => {
      promises.push(this.fetchDocuments(aggQueries[contentType], locale, contentType, paths, [], queries,
        result, shelf, true))
    })

    // wait for all promises to be resolved
    await Promise.all(promises)

    return {
      queries,
      result,
      shelf,
    }
  }

  private async getAllReferencePaths(contentTypeQueries: IQuery, locale: string) {
    const contents: any[] = await readFile(getContentTypesPath(locale) + '.json')
    const filteredContents: any[] = contents.filter(sift(contentTypeQueries))
    const ctQueries: IQuery = {
      $or: [],
    }
    let paths: string[] = []

    for (let i = 0, j = filteredContents.length; i < j; i++) {
      let assetFieldPaths: string[]
      let entryReferencePaths: string[]
      if (filteredContents[i]?.hasOwnProperty(this.types.assets)) {
        assetFieldPaths = Object.keys(filteredContents[i][this.types.assets])
        paths = paths.concat(assetFieldPaths)
      }
      if (filteredContents[i]?.hasOwnProperty('_references')) {
        entryReferencePaths = Object.keys(filteredContents[i][this.types.references])
        paths = paths.concat(entryReferencePaths)

        for (let k = 0, l = entryReferencePaths.length; k < l; k++) {
          if (typeof filteredContents[i][this.types.references][entryReferencePaths[k]] === 'string') {
            ctQueries.$or.push({
              _content_type_uid: this.types.content_types,
              // this would probably make it slow in FS, avoid this?
              // locale,
              uid: filteredContents[i][this.types.references][entryReferencePaths[k]],
            })
          } else if (filteredContents[i][this.types.references][entryReferencePaths[k]].length) {
            filteredContents[i][this.types.references][entryReferencePaths[k]].forEach((uid) => {
              ctQueries.$or.push({
                _content_type_uid: this.types.content_types,
                // Question: Adding extra key in query, slows querying down? Probably yes.
                // locale,
                uid,
              })
            })
          }
        }
      }
    }

    return {
      ctQueries,
      paths,
    }
  }
}
