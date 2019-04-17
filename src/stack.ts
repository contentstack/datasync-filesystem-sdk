/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

import fs from 'fs'
import { default as mask } from 'json-mask'
import { cloneDeep, filter, find, map, merge, orderBy, uniq } from 'lodash'
import path from 'path'
import { default as sift } from 'sift'
import { promisify } from 'util'
import { defaultConfig } from './default'
import { checkCyclic, difference } from './utils'


const readFile: any = promisify(fs.readFile)

const extend = {
    compare(type) {
        return function(key, value) {
            if (key && value && typeof key === 'string' && typeof value !== 'undefined') {
                this.q.query = this.q.query || {}
                this.q.query[key] = this.q.query.file_size || {}
                this.q.query[key][type] = value

                return this
            }
            throw new Error('Kindly provide valid parameters.')

        }
    },
    contained(bool) {
        const type = (bool) ? '$in' : '$nin'

        return function(key, value) {
            if (key && value && typeof key === 'string' && Array.isArray(value)) {
                this.q.query = this.q.query || {}
                this.q.query[key] = this.q.query[key] || {}
                this.q.query[key][type] = this.q.query[key][type] || []
                this.q.query[key][type] = this.q.query[key][type].concat(value)

                return this
            }
            throw new Error('Kindly provide valid parameters.')
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
            throw new Error('Kindly provide valid parameters.')
        }
    },
    logical(type) {
        return function() {
            this.q.logical = this.q.logical || {}
            this.q.logical[type] = this.q.logical[type] || {}
            this.q.logical[type] = this.q.query
            delete this.q.query

            return this
        }
    },
    sort(type) {
        return function(key) {
            if (key && typeof key === 'string') {
                this.q[type] = key

                return this
            }
            throw new Error('Argument should be a string.')

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
    public baseDir: any
    public masterLocale: any
    public config: any
    public contentTypeUid: string
    public type: string
    public q: any = {}
    public assetUid: any
    public entryUid: any
    public lessThan: (key: any, value: any) => any
    public lessThanOrEqualTo: (key: any, value: any) => any
    public greaterThan: (key: any, value: any) => any
    public greaterThanOrEqualTo: (key: any, value: any) => any
    public notEqualTo: (key: any, value: any) => any
    public containedIn: (key: any, value: any) => any
    public notContainedIn: (key: any, value: any) => any
    public exists: (key: any) => any
    public notExists: (key: any) => any
    public ascending: (key: any) => any
    public descending: (key: any) => any
    public skip: (value: any) => any
    public limit: (value: any) => any
    public or: () => any
    public nor: () => any
    public not: () => any
    public and: () => any

    constructor(...stackArguments) {
        this.config = merge(defaultConfig, ...stackArguments)
        this.q = this.q || {}
        this.q.query = this.q.query || {}

        /**
         * @method lessThan
         * @description Retrieves entries in which the value of a field is lesser than the provided value
         * @param {String} key - uid of the field
         * @param {*} value - Value used to match or compare
         * @example 
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.lessThan('created_at','2015-06-22').find()
         * data.then(function (result) {
         *      // result content the data who's 'created_at date'
         *      //is less than '2015-06-22'
         * },function (error) {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.lessThan = extend.compare('$lt')

        /**
         * @method lessThanOrEqualTo
         * @description Retrieves entries in which the value of a field is lesser than or equal to the provided value.
         * @param {String} key - uid of the field
         * @param {*} value - Value used to match or compare
         * @example 
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.lessThanOrEqualTo('created_at','2015-06-22').find()
         * data.then(function (result) {
         *      // result contain the data of entries where the
         *      //'created_at' date will be less than or equalto '2015-06-22'.
         * },function (error) {
         *      // error function
         * })
         *@returns {this} - Returns `stack's` instance
         */
        this.lessThanOrEqualTo = extend.compare('$lte')

        /**
         * @method greaterThan
         * @description Retrieves entries in which the value for a field is greater than the provided value.
         * @param {String} key - uid of the field
         * @param {*} value -  value used to match or compare
         * @example
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.greaterThan('created_at','2015-03-12').find()
         * data.then(function(result) {
         *      // result contains the data of entries where the
         *      //'created_at' date will be greaterthan '2015-06-22'
         * },function (error) {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.greaterThan = extend.compare('$gt')

        /**
         * @method greaterThanOrEqualTo
         * @description Retrieves entries in which the value for a field is greater than or equal to the provided value.
         * @param {String} key - uid of the field
         * @param {*} value - Value used to match or compare
         * @example 
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.greaterThanOrEqualTo('created_at','2015-03-12').find()
         * data.then(function(result) {
         *      // result contains the data of entries where the
         *      //'created_at' date will be  greaterThan or equalto '2015-06-22'
         * },function (error) {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.greaterThanOrEqualTo = extend.compare('$gte')

        /**
         * @method notEqualTo
         * @description Retrieves entries in which the value for a field does not match the provided value.
         * @param {String} key - uid of the field
         * @param {*} value - Value used to match or compare
         * @example 
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.notEqualTo('title','Demo').find()
         * data.then(function(result) {
         *      // ‘result’ contains the list of entries where value
         *      //of the ‘title’ field will not be 'Demo'.
         * },function (error) {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.notEqualTo = extend.compare('$ne')

        /**
         * @method containedIn
         * @description Retrieve entries in which the value of a field matches with any of the provided array of values
         * @param {String} key - uid of the field
         * @param {*} value - Array of values that are to be used to match or compare
         * @example 
         * let blogQuery = Stack().contentType('example').entries().query();
         * let data = blogQuery.containedIn('title', ['Demo', 'Welcome']).find()
         * data.then(function(result) {
         *      // ‘result’ contains the list of entries where value of the
         *      // ‘title’ field will contain either 'Demo' or ‘Welcome’.
         * },function (error) {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.containedIn = extend.contained(true)

        /**
         * @method notContainedIn
         * @description Retrieve entries in which the value of a field does not match
         *              with any of the provided array of values.
         * @param {String} key - uid of the field
         * @param {Array} value - Array of values that are to be used to match or compare
         * @example 
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.notContainedIn('title', ['Demo', 'Welcome']).find()
         * data.then(function(result) {
         *      // 'result' contains the list of entries where value of the
         *      //title field should not be either "Demo" or ‘Welcome’
         * },function (error) {
         *      // error function
         * })
         *@returns {this} - Returns `stack's` instance
         */
        this.notContainedIn = extend.contained(false)

        /**
         * @method exists
         * @description Retrieve entries if value of the field, mentioned in the condition, exists.
         * @param {String} key - uid of the field
         * @example 
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.exists('featured').find()
         * data.then(function(result) {
         *      // ‘result’ contains the list of entries in which "featured" exists.
         * },function (error) {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.exists = extend.exists(true)

        /**
         * @method notExists
         * @description Retrieve entries if value of the field, mentioned in the condition, does not exists.
         * @param {String} key - uid of the field
         * @example 
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.notExists('featured').find()
         * data.then(function(result) {
         *      // result is the list of non-existing’featured’" data.
         * },function (error) {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.notExists = extend.exists(false)

        /**
         * @method ascending
         * @description Sort fetched entries in the ascending order with respect to a specific field.
         * @param {String} key - field uid based on which the ordering will be done
         * @example 
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.ascending('created_at').find()
         * data.then(function(result) {
         *      // ‘result’ contains the list of entries which is sorted in
         *      //ascending order on the basis of ‘created_at’.
         * },function (error) {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.ascending = extend.sort('asc')

        /**
         * @method descending
         * @description Sort fetched entries in the descending order with respect to a specific field
         * @param {String} key - field uid based on which the ordering will be done.
         * @example 
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.descending('created_at').find()
         * data.then(function(result) {
         *      // ‘result’ contains the list of entries which is sorted in
         *      //descending order on the basis of ‘created_at’.
         * },function (error) {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.descending = extend.sort('desc')


        /**
         * @method skip
         * @description Skips at specific number of entries.
         * @param {Number} skip - number of entries to be skipped
         * @example 
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.skip(5).find()
         * data.then(function(result) {
         *      //result 
         * },function (error) {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.skip = extend.pagination('skip')

        /**
         * @method limit
         * @description Returns a specific number of entries based on the set limit
         * @param {Number} limit - maximum number of entries to be returned
         * @example 
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.limit(10).find()
         * data.then(function(result) {
         *      // result contains the limited number of entries
         * },function (error) {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.limit = extend.pagination('limit')

        /**
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
   * @method connect
   * @summary
   *  Establish connection to filesytem
   * @param {Object} overrides - Config overrides/flesystem specific config
   * @example
   * Stack.connect({overrides})
   *  .then((result) => {
   *    
   *  })
   *  .catch((error) => {
   *    // handle query errors
   *  })
   * 
   * @returns {string} baseDir
   */
    public connect(overrides: object = {}) {
        this.config = merge(this.config, overrides)

        return new Promise((resolve, reject) => {
            try {
                this.baseDir = (process.env.CONTENT_DIR) ? path.resolve(process.env.CONTENT_DIR) :
                    (fs.existsSync(path.resolve(path.join(__dirname, '../../../', this.config.contentStore.baseDir)))) ?
                        path.resolve(path.join(__dirname, '../../../', this.config.contentStore.baseDir)) :
                        path.resolve(path.join(process.cwd(), '_contents'))
                if (typeof this.baseDir !== 'string' || !fs.existsSync(this.baseDir)) {
                    throw new Error('Could not resolve ' + this.baseDir)
                }
                if (!this.config.hasOwnProperty('locales') || !(Array.isArray(this.config.locales))
                    || this.config.locales.length === 0) {
                    throw new Error('Please provide locales with code and relative_url_prefix.')
                }
                this.masterLocale = this.config.locales[0].code

                return resolve(this.baseDir)
            } catch (error) {
                reject(error)
            }
        })
    }

  /**
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
   */
    public contentType(uid) {
        const stack = new Stack(this.config)
        stack.baseDir = this.baseDir
        stack.masterLocale = this.masterLocale
        if (!uid) {
            throw new Error('Please provide valid uid')
        } else if (uid && typeof uid === 'string') {
            stack.contentTypeUid = uid
            stack.type = 'contentType'
        }

        return stack
    }

  /**
   * @method entries
   * @summary
   *  To get entries from contentType
   * @example 
   * Stack.contentType('example').entries().find()
   * @returns {this} - Returns `stack's` instance
   */
    public entries() {

        this.q.isEntry = true
        if (this.type === undefined) {
            throw new Error('Please call contentType(\'uid\') first')
        }

        return this
    }

  /**
   * @method entry
   * @summary
   *  To get entry from contentType
   * @example 
   * Stack.contentType('example').entry('bltabcd12345').find()
   * //or
   * Stack.contentType('example').entry().find()
   * @param {string} uid- Optional. uid of entry
   * @returns {this} - Returns `stack's` instance
   */
    public entry(uid?) {

        this.q.isEntry = true
        this.q.single = true
        if (this.type === undefined) {
            throw new Error('Please call contentType(\'uid\') first')
        }
        if (uid && typeof uid === 'string') {
            this.entryUid = uid

            return this
        }

        return this
    }

  /**
   * @method asset
   * @summary
   *  To get single asset
   * @example 
   * Stack.asset('bltabced12435').find()
   * //or
   * Stack.asset().find()
   * @param {string} uid- Optional. uid of asset
   * @returns {this} - Returns `stack's` instance
   */
    public asset(uid?) {
        const stack = new Stack(this.config)
        stack.baseDir = this.baseDir
        stack.masterLocale = this.masterLocale
        stack.type = 'asset'
        stack.q.single = true
        if (uid && typeof uid === 'string') {
            stack.assetUid = uid

            return stack
        }

        return stack
    }

  /**
   * @method assets
   * @summary
   * To get assets
   * @example 
   * Stack.assets().find()
   * @returns {this} - Returns `stack's` instance
   */
    public assets() {
        const stack = new Stack(this.config)
        stack.baseDir = this.baseDir
        stack.masterLocale = this.masterLocale
        stack.type = 'asset'

        return stack
    }

    /**
     * @method equalTo
     * @description Retrieve entries in which a specific field satisfies the value provided
     * @param {String} key - uid of the field
     * @param {*} value - value used to match or compare
     * @example 
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.equalTo('title','Demo').find()
     * data.then(function(result) {
     *      // ‘result’ contains the list of entries where value of 
     *      //‘title’ is equal to ‘Demo’.
     * },function (error) {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */

    public equalTo(key, value) {
        if (key && typeof key === 'string') {
            this.q.query[key] = value

            return this
        }
        throw new Error('Kindly provide valid parameters.')

    }

  /**
   * @method where
   * @summary
   *  Pass JS expression or a full function to the query system
   * @description
   *  - Use the $where operator to pass either a string containing a JavaScript expression
   *    or a full JavaScript function to the query system.
   *  - The $where provides greater flexibility, but requires that the database processes
   *    the JavaScript expression or function for each document in the collection.
   *  - Reference the document in the JavaScript expression or function using either this or obj.
   * @note
   *  - Only apply the $where query operator to top-level documents.
   *  - The $where query operator will not work inside a nested document, for instance,
   *    in an $elemMatch query.
   * @link
   *  https://docs.mongodb.com/manual/reference/operator/query/where/index.html
   * @param field
   * @param value
   * @returns {this} - Returns `stack's` instance
   * @example 
   * let blogQuery = Stack().contentType('example').entries();
   * let data = blogQuery.where("this.title === 'Amazon_Echo_Black'").find()
   * data.then(function(result) {
   *        // ‘result’ contains the list of entries where value of 
   *        //‘title’ is equal to ‘Demo’.
   * },function (error) {
   *         // error function
   * })
   */

    public where(expr) {
        if (expr) {
            this.q.query.$where = expr

            return this
        }
        throw new Error('Kindly provide a valid field and expr/fn value for \'.where()\'')

    }


    /**
     * @method count
     * @description Returns the total number of entries
     * @example 
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.count().find()
     * data.then(function(result) {
     *      // ‘result’ contains the total count.
     * },function (error) {
     *      // error function
     * })
     *@returns {this} - Returns `stack's` instance
     */
    public count() {
        this.q.count = true

        return this
    }

    /**
     * @method query
     * @description Retrieve entries based on raw queries
     * @param {object} userQuery - RAW (JSON) queries
     * @returns {this} - Returns `stack's` instance
     * @example
     * Stack.contentType('example').entries().query({"authors.name": "John Doe"}).find()
     * .then((result) => {
     *    // returns entries, who's reference author's name equals "John Doe"
     * })
     * .catch((error) => {
     *    // handle query errors
     * })
     */
    public query(userQuery) {
        if (typeof userQuery === 'object') {
            this.q.query = merge(this.q.query, userQuery)

            return this
        }
        throw new Error('Kindly provide valid parameters')

    }

    /**
     * @method tags
     * @description Retrieves entries based on the provided tags
     * @param {Array} values - tags
     * @example
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.tags(['technology', 'business']).find()
     * data.then(function(result) {
     *      // ‘result’ contains list of entries which have tags "’technology’" and ‘"business’".
     * },function (error) {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    public tags(values) {
        if (Array.isArray(values)) {
            this.q.tags = values

            return this
        }
        throw new Error('Kindly provide valid parameters')

    }

    /**
     * @method includeCount
     * @description Includes the total number of entries returned in the response.
     * @example
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.includeCount().find()
     * data.then(function(result) {
     *      // ‘result’ contains a list of entries in which count of object is present at array[1] position.
     * },function (error) {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    public includeCount() {
        this.q.include_count = true

        return this
    }

    /**
     * @method language
     * @description to retrive the result bsed on the specific locale.
     * @example 
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.language('fr-fr').find()
     * data.then(function(result) {
     *      // ‘result’ contains a list of entries of locale fr-fr
     * },function (error) {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    public language(languageCode) {
        if (languageCode && typeof languageCode === 'string') {
            this.q.locale = languageCode

            return this
        }
        throw new Error('Argument should be a String.')

    }
    /**
   * @method include
   * @summary
   *  Includes references of provided fields of the entries being scanned
   * @param {*} key - uid/uid's of the field
   * @returns {this} - Returns `stack's` instance
   * @example 
   * Stack().contentType('example').entries().include(['authors','categories']).find()
   * .then(function(result) {
   *        // ‘result’ inclueds entries with references of authors and categories filed's
   * },function (error) {
   *        // error function
   * })
   */

    public include(fields) {
        if (fields.length === 0) {
          throw new Error('Kindly pass a valid reference field path to \'.include()\' ')
        } else if (typeof fields === 'string') {
          this.q.includeSpecificReferences = [fields]
        } else {
          this.q.includeSpecificReferences = fields
        }
    
        return this
      }
  /**
   * @method includeReferences
   * @summary
   *  Includes all references of the entries being scanned
   * @returns {this} - Returns `stack's` instance
   * @example 
   * Stack().contentType('example').entries().includeReferences().find()
   * .then(function(result) {
   *        // ‘result’ entries with references
   * },function (error) {
   *        // error function
   * })
   */
    public includeReferences() {
        this.q.includeReferences = true

        return this
    }
  /**
   * @method excludeReferences
   * @summary
   *  Excludes all references of the entries being scanned
   * @returns {this} - Returns `stack's` instance
   * @example
   * Stack().contentType('example').entries().excludeReferences().find()
   * .then(function(result) {
   *    // ‘result’ entries without references
   *  },function (error) {
   *    // error function
   *  })
   */
    public excludeReferences() {
        this.q.excludeReferences = true

        return this
    }

    /**
     * @method includeContentType
     * @description Includes the total number of entries returned in the response.
     * @example 
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.includeContentType().find()
     * data.then(function(result) {
     *      // ‘result’ contains a list of entries along contentType
     * },function (error) {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    public includeContentType() {
        this.q.include_content_type = true

        return this
    }


    /**
     * @method getQuery
     * @description Returns the raw (JSON) query based on the filters applied on Query object.
     * @example 
     * Stack.contentType('contentType_uid').eqaulTo('title','Demo').getQuery().find()
     * @returns {this} - Returns `stack's` instance
     */
    public getQuery() {

        return this.q.query
    }

    /**
     * @method regex
     * @description Retrieve entries that match the provided regular expressions
     * @param {String} key - uid of the field
     * @param {*} value - value used to match or compare
     * @param {String} [options] - match or compare value in entry
     * @example
     * let blogQuery = Stack().contentType('example').entries();
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
        throw new Error('Kindly provide valid parameters.')

    }

    /**
     * @method only
     * @example 
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.only(['title','uid']).find()
     * data.then(function(result) {
     *      // ‘result’ contains a list of entries with field title and uid only
     * },function (error) {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    public only(fields) {
        if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'only()\'')
        }
        this.q.only = this.q.only || {}
        this.q.only = fields

        return this
    }

    /**
     * @method except
     * @example 
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.except(['title','uid']).find()
     * data.then(function(result) {
     *      // ‘result’ contains a list of entries without fields title and uid only
     * },function (error) {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    public except(fields) {
        if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'except()\'')
        }
        this.q.except = this.q.except || {}
        this.q.except = fields

        return this
    }

    /**
     * @method queryReferences
     * @summary
     *  Wrapper, that allows querying on the entry's references.
     * @note
     *  This is a slow method, since it scans all documents and fires the `reference` query on them
     *  Use `.query()` filters to reduce the total no of documents being scanned
     * @returns {this} - Returns `stack's` instance
     * @example
     * Stack.contentType('blog').entries().queryReferences({"authors.name": "John Doe"})
     * .find()
     * .then((result) => {
     *    // returns entries, who's reference author's name equals "John Doe"
     * })
     * .catch((error) => {
     *    // handle query errors
     * })
     */
    public queryReferences(query) {
        if (query && typeof query === 'object') {
            this.q.queryReferences = query

            return this
        }
        throw new Error('Kindly pass a query object for \'.queryReferences()\'')
    }

  /**
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
        const baseDir = this.baseDir
        const masterLocale = this.masterLocale
        const contentTypeUid = this.contentTypeUid
        const locale = (!this.q.locale) ? masterLocale : this.q.locale

        return new Promise((resolve, reject) => {
            try {
                let dataPath
                let schemaPath
                if (this.type === 'asset') {
                    dataPath = path.join(baseDir, locale, 'assets', '_assets.json')
                } else {
                    dataPath = path.join(baseDir, locale, 'data', contentTypeUid, 'index.json')
                    schemaPath = path.join(baseDir, locale, 'data', contentTypeUid, '_schema.json')
                }

                if (!fs.existsSync(dataPath)) {

                    return reject('content-type or entry not found')
                }

                fs.readFile(dataPath, 'utf8', async (err, data) => {
                    if (err) {
                        return reject(err)
                    }
                    const finalResult = {
                        content_type_uid: this.contentTypeUid || '_assets',
                        locale,
                    }
                    let type = (this.type !== 'asset') ? 'entries' : 'assets'
                    if (data === undefined || data === '') {

                        if (this.q.single) {
                            type = (type === 'entries') ? 'entry' : 'asset'
                            finalResult[type] = {}
                            this.q = {}

                            return resolve(finalResult)
                        }
                        finalResult[type] = []
                        this.q = {}

                        return resolve(finalResult)
                    }
                    data = JSON.parse(data)
                    let filteredData = map(data, 'data')
                    if (this.assetUid || this.entryUid) {
                        const uid = this.assetUid || this.entryUid
                        filteredData = find(filteredData, ['uid', uid])
                    }

                    if (this.q.queryReferences) {
                        return this.queryOnReferences(filteredData, finalResult, locale, type, schemaPath)
                            .then(resolve)
                            .catch(reject)
                    }

                    if (this.q.excludeReferences) {
                        const preProcessedData = this.preProcess(filteredData)
                        this.postProcessResult(finalResult, preProcessedData, type, schemaPath)
                            .then((result) => {
                                this.q = {}

                                return resolve(result)
                            }).catch(reject)

                    }  else if (this.q.includeSpecificReferences) {
                        return this.includeSpecificReferences(filteredData, locale, {}, undefined, this.q.includeSpecificReferences)
                            .then(() => {
                                const preProcessedData = this.preProcess(filteredData)
                                this.postProcessResult(finalResult, preProcessedData, type, schemaPath)
                                    .then((result)=>{   
                                        this.q = {}

                                        return resolve(result)
                                    }).catch(reject)
                            }).catch(reject)
                    } else {
                        return this.includeReferencesI(filteredData, locale, {}, undefined)
                            .then(async () => {
                                const preProcessedData = this.preProcess(filteredData)
                                this.postProcessResult(finalResult, preProcessedData, type, schemaPath)
                                    .then((result) => {
                                        this.q = {}

                                        return resolve(result)
                                    }).catch(reject)
                            })
                            .catch(reject)
                    }

                })

            } catch (error) {

                return reject(error)

            }
        })

    }
    
    /**
   * @summary
   *  Internal method, that iteratively calls itself and binds entries reference
   * @param {Object} entry - An entry or a collection of entries, who's references are to be found
   * @param {String} locale - Locale, in which the reference is to be found
   * @param {Object} references - A map of uids tracked thusfar (used to detect cycle)
   * @param {String} parentUid - Entry uid, which is the parent of the current `entry` object
   * @returns {Object} - Returns `entry`, that has all of its reference binded
   */
  private includeSpecificReferences(entry, locale, references, parentUid?, includePths = [], parentField = '') {
    const self = this

    return new Promise((resolve, reject) => {
      if (entry === null || typeof entry !== 'object') {
        return resolve()
      }

      // current entry becomes the parent
      if (entry.uid) {
        parentUid = entry.uid
      }

      const referencesFound = []

      // iterate over each key in the object
      for (const prop in entry) {
        if (entry[prop] !== null && typeof entry[prop] === 'object') {
          let currentPth
          if (parentField === '' && isNaN(parseInt(prop))) {
            currentPth = prop
          } else if (parentField === '' && !isNaN(parseInt(prop))) {
            currentPth = parentField
          } else {
            currentPth = parentField.concat('.', prop)
          }

          if (entry[prop] && entry[prop].reference_to) {
            if (entry[prop].reference_to === '_assets' || this.isPartOfInclude(currentPth, includePths)) {
              if (entry[prop].values.length === 0) {
                entry[prop] = []
              } else {
                let uids = entry[prop].values
                if (typeof uids === 'string') {
                  uids = [uids]
                }
                if (entry[prop].reference_to !== '_assets') {
                  uids = filter(uids, (uid) => {
                    return !(checkCyclic(uid, references))
                  })
                }
                if (uids.length) {
                const query = {
                    content_type_uid: entry[prop].reference_to,
                    locale,
                    query: {
                        uid: {
                            $in: uids,
                        },
                    },
                }


                  referencesFound.push(new Promise((rs, rj) => {

                    return self.findReferences(query).then((entities) => {
                        entities = cloneDeep(entities)
                        if ((entities as any).length === 0) {
                            entry[prop] = []

                            return rs()
                        } else if (parentUid) {
                            references[parentUid] = references[parentUid] || []
                            references[parentUid] = uniq(references[parentUid]
                                .concat(map((entities as any), 'uid')))
                        }
                        if (typeof entry[prop].values === 'string') {
                            entry[prop] = ((entities === null) ||
                                (entities as any).length === 0) ? null
                                : entities[0]
                        } else {
                            // format the references in order
                            const referenceBucket = []
                            query.query.uid.$in.forEach((entityUid) => {
                                const elem = find(entities, (entity) => {

                                    return (entity as any).uid === entityUid
                                })
                                if (elem) {
                                    referenceBucket.push(elem)
                                }
                            })
                            entry[prop] = referenceBucket
                        }

                        return self.includeSpecificReferences(entry[prop], locale, references, parentUid, includePths, currentPth)
                          .then(rs)
                          .catch(rj)
                    })
                }))
                }
              }
            }else{
                entry[prop]={}
            }
          } else {
            referencesFound.push(self.includeSpecificReferences(entry[prop], locale, references, parentUid, includePths, currentPth))
          }
        }
      }

      return Promise.all(referencesFound)
        .then(resolve)
        .catch(reject)
    })
  }

  private isPartOfInclude(pth, include) {
    for (let i = 0, j = include.length; i < j; i++) {
      if (include[i].indexOf(pth) !== -1) {
        return true
      }
    }

    return false
  }

  /**
   * @method findOne
   * @description
   * Queries the db using the query built/passed. Returns a single entry/asset/content type object
   * Does all the processing, filtering, referencing after querying the DB
   * @param {object} query Optional query object, that overrides all the previously build queries
   * 
   * @example
   * Stack.contentType('blog').entries().findOne()
   * .then((result) => {
   *    // returns an entry
   * })
   * .catch((error) => {
   *    // handle query errors
   * })
   * 
   * @returns {object} - Returns an object, that has been processed, filtered and referenced
   */

    public findOne() {
        this.q.single = true

        return new Promise((resolve, reject) => {
            this.find().then((result) => {

                return resolve(result)
            }).catch((error) => {

                return reject(error)
            })
        })
    }

    private queryOnReferences(filteredData, finalResult, locale, type, schemaPath) {
        return new Promise((resolve, reject) => {

            return this.includeReferencesI(filteredData, locale, {}, undefined)
                .then(async () => {
                    const result = sift(this.q.queryReferences, filteredData)
                    const preProcessedData = this.preProcess(result)
                    this.postProcessResult(finalResult, preProcessedData, type, schemaPath).then((res) => {
                        this.q = {}

                        return resolve(res)
                    })

                })
                .catch(reject)

        })
    }

    private findReferences(query) {
        return new Promise((resolve, reject) => {
            let pth
            if (query.content_type_uid === '_assets') {
                pth = path.join(this.baseDir, query.locale, 'assets', '_assets.json')
            } else {
                pth = path.join(this.baseDir, query.locale, 'data', query.content_type_uid, 'index.json')
            }
            if (!fs.existsSync(pth)) {

                return resolve([])
            }

            return fs.readFile(pth, 'utf-8', (readError, data) => {
                if (readError) {

                    return reject(readError)
                }
                if (!data) {

                    return resolve()
                }
                data = JSON.parse(data)
                data = (map(data, 'data') as any)
                data = sift(query.query, (data as any))

                return resolve(data)
            })
        })
    }

    private includeReferencesI(entry, locale, references, parentUid?) {
        const self = this

        return new Promise((resolve, reject) => {
            if (entry === null || typeof entry !== 'object') {

                return resolve()
            }

            // current entry becomes the parent
            if (entry.uid) {
                parentUid = entry.uid
            }

            const referencesFound = []

            // iterate over each key in the object
            for (const prop in entry) {
                if (entry[prop] !== null && typeof entry[prop] === 'object') {
                    if (entry[prop] && entry[prop].reference_to) {
                        if ((!(this.q.includeReferences) && entry[prop].reference_to === '_assets')
                            || this.q.includeReferences) {
                            if (entry[prop].values.length === 0) {
                                entry[prop] = []
                            } else {
                                let uids = entry[prop].values
                                if (typeof uids === 'string') {
                                    uids = [uids]
                                }
                                if (entry[prop].reference_to !== '_assets') {
                                    uids = filter(uids, (uid) => {

                                        return !(checkCyclic(uid, references))
                                    })
                                }
                                if (uids.length) {
                                    const query = {
                                        content_type_uid: entry[prop].reference_to,
                                        locale,
                                        query: {
                                            uid: {
                                                $in: uids,
                                            },
                                        },
                                    }

                                    referencesFound.push(new Promise((rs, rj) => {

                                        return self.findReferences(query).then((entities) => {
                                            entities = cloneDeep(entities)
                                            if ((entities as any).length === 0) {
                                                entry[prop] = []

                                                return rs()
                                            } else if (parentUid) {
                                                references[parentUid] = references[parentUid] || []
                                                references[parentUid] = uniq(references[parentUid]
                                                    .concat(map((entities as any), 'uid')))
                                            }
                                            if (typeof entry[prop].values === 'string') {
                                                entry[prop] = ((entities === null) ||
                                                    (entities as any).length === 0) ? null
                                                    : entities[0]
                                            } else {
                                                // format the references in order
                                                const referenceBucket = []
                                                query.query.uid.$in.forEach((entityUid) => {
                                                    const elem = find(entities, (entity) => {

                                                        return (entity as any).uid === entityUid
                                                    })
                                                    if (elem) {
                                                        referenceBucket.push(elem)
                                                    }
                                                })
                                                entry[prop] = referenceBucket
                                            }

                                            return self.includeReferencesI(entry[prop], locale, references, parentUid)
                                                .then(rs)
                                                .catch(rj)
                                        })
                                    }))
                                }
                            }
                        }
                    } else {
                        referencesFound.push(self.includeReferencesI(entry[prop], locale, references, parentUid))
                    }
                }
            }

            return Promise.all(referencesFound)
                .then(resolve)
                .catch(reject)
        })
    }



    private preProcess(filteredData) {
        filteredData = filteredData.filter(data => !data.hasOwnProperty('download_id'))
        console.log(filteredData,"filteredData",filteredData.length)
        const sortKeys: any = ['asc', 'desc']

        const sortQuery: any = Object.keys(this.q)
            .filter((key) => sortKeys.includes(key))
            .reduce((obj, key) => {

                return {
                    ...obj,
                    [key]: this.q[key],
                }
            }, {})
        if (this.q.asc || this.q.desc) {
            const value: any = (Object as any).values(sortQuery)
            const key: any = Object.keys(sortQuery)
            filteredData = orderBy(filteredData, value, key)
        }

        if (this.q.query && Object.keys(this.q.query).length > 0) {
            filteredData = sift(this.q.query, filteredData)
        } else if (this.q.logical) {
            const operator = Object.keys(this.q.logical)[0]
            const vals: any = (Object as any).values(this.q.logical)
            const values = JSON.parse(JSON.stringify(vals).replace(/\,/, '},{'))
            const logicalQuery = {}
            logicalQuery[operator] = values
            filteredData = sift(logicalQuery, filteredData)
        } else {
            filteredData = filteredData
        }

        if ((this.q.skip) && ((this.q.limit))) {
            filteredData = filteredData.splice(this.q.skip, this.q.limit)
        } else if ((this.q.skip)) {
            filteredData = filteredData.slice(this.q.skip)
        } else if (this.q.limit) {
            filteredData = filteredData.splice(0, this.q.limit)
        }

        if (this.q.only) {
            const only = this.q.only.toString().replace(/\./g, '/')
            filteredData = mask(filteredData, only)
        }

        if (this.q.except) {
            const bukcet = this.q.except.toString().replace(/\./g, '/')
            const except = mask(filteredData, bukcet)
            filteredData = difference(filteredData, except)
        }

        if (this.q.tags) {
            filteredData = sift({
                tags: {
                    $in: this.q.tags,
                },
            }, filteredData)
        }
        return filteredData
    }

    private postProcessResult(finalResult, result, type, schemaPath) {
        return new Promise((resolve, reject) => {
            try {
                if (this.q.count) {
                    if (result instanceof Array) {
                        (finalResult as any).count = result.length
                    } else if (this.q.single && result !== undefined) {
                        (finalResult as any).count = 1
                    } else {
                        (finalResult as any).count = 0
                    }
                } else {
                    finalResult[type] = result
                }

                if (this.q.single) {
                    delete finalResult[type]
                    type = (type === 'entries') ? 'entry' : 'asset'
                    if (result === undefined) {
                        finalResult[type] = {}
                    } else {
                        finalResult[type] = result[0] || result
                    }
                }

                if (this.q.include_count) {
                    if (result instanceof Array) {
                        (finalResult as any).count = result.length
                    } else if (this.q.single && result !== undefined) {
                        (finalResult as any).count = 1
                    } else {
                        (finalResult as any).count = 0
                    }

                }

                if (this.q.include_content_type) {
                    if (!fs.existsSync(schemaPath)) {
                        return reject('content type not found')
                    }
                    let contents
                    readFile(schemaPath).then((data) => {
                        contents = JSON.parse(data);
                        (finalResult as any).content_type = contents

                        return resolve(finalResult)
                    }).catch(() => {
                        (finalResult as any).content_type = {}

                        return resolve(finalResult)
                    })
                } else {
                    return resolve(finalResult)
                }
            } catch (error) {
                return reject(error)
            }
        })
    }
}
