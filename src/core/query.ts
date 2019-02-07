/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */
import * as fs from 'fs'
import { default as mask } from 'json-mask'
import { cloneDeep, filter, find, map, orderBy, uniq } from 'lodash'
import * as path from 'path'
import { default as sift } from 'sift'
import { checkCyclic, difference, mergeDeep } from './utils'
import { promisify } from 'util'

const readFile: any = promisify(fs.readFile);

const extend = {
    compare(type) {
        return function (key, value) {
            if (key && value && typeof key === 'string' && typeof value !== 'undefined') {
                this.q.query = this.q.query || {}
                this.q.query[key] = this.q.query.file_size || {}
                this.q.query[key][type] = value
                return this
            } else {
                console.error('Kindly provide valid parameters.')
            }
        }
    },
    contained(bool) {
        const type = (bool) ? '$in' : '$nin'
        return function (key, value) {
            if (key && value && typeof key === 'string' && Array.isArray(value)) {
                this.q.query = this.q.query || {}
                this.q.query[key] = this.q.query[key] || {}
                this.q.query[key][type] = this.q.query[key][type] || []
                this.q.query[key][type] = this.q.query[key][type].concat(value)
                return this
            } else {
                console.error('Kindly provide valid parameters.')
            }
        }
    },
    exists(bool) {
        return function (key) {
            if (key && typeof key === 'string') {
                this.q.query = this.q.query || {}
                this.q.query[key] = this.q.query[key] || {}
                this.q.query[key].$exists = bool
                return this
            } else {
                console.error('Kindly provide valid parameters.')
            }
        }
    },
    logical(type) {
        return function () {
            this.q.logical = this.q.logical || {}
            this.q.logical[type] = this.q.logical[type] || {}
            this.q.logical[type] = this.q.query
            delete this.q.query
            return this
        }
    },
    sort(type) {
        return function (key) {
            if (key && typeof key === 'string') {
                this.q[type] = key
                return this
            } else {
                console.error('Argument should be a string.')
            }
        }
    },
    pagination(type) {
        return function (value) {
            if (typeof value === 'number') {
                this.q[type] = value
                return this
            } else {
                console.error('Argument should be a number.')
            }
        }
    },
}

/**
 * @summary
 *  Expose SDK query methods on Stack
 * @returns
 *  'Query' instance
 */
export class Query {
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
    public baseDir: any
    public masterLocale: any
    public content_type_uid: any
    public type: string
    public single: boolean = false
    private q: any

    constructor() {
        this.q = this.q || {}
        this.q.query = this.q.query || {}

        /**
          * @method lessThan
          * @description Retrieves entries in which the value of a field is lesser than the provided value
          * @param {String} key - uid of the field
          * @param {*} value - Value used to match or compare
          * @example let blogQuery = Stack().contentType('example').entries().query();
          *          let data = blogQuery.lessThan('created_at','2015-06-22').find()
          *          data.then(function (result) {
          *          // result content the data who's 'created_at date' is less than '2015-06-22'
          *       },function (error) {
          *          // error function
          *      })
          * @returns {query}
          */
        this.lessThan = extend.compare('$lt')

        /**
          * @method lessThanOrEqualTo
          * @description Retrieves entries in which the value of a field is lesser than or equal to the provided value.
          * @param {String} key - uid of the field
          * @param {*} value - Value used to match or compare
          * @example let blogQuery = Stack().contentType('example').entries().query();
          *          let data = blogQuery.lessThanOrEqualTo('created_at','2015-06-22').find()
          *          data.then(function (result) {
          *          // result contain the data of entries where the 'created_at' date will be less than or equalto '2015-06-22'.
          *       },function (error) {
          *          // error function
          *      })
          * @returns {query}
          */
        this.lessThanOrEqualTo = extend.compare('$lte')

        /**
        * @method greaterThan
        * @description Retrieves entries in which the value for a field is greater than the provided value.
        * @param {String} key - uid of the field
        * @param {*} value -  value used to match or compare
        * @example
        *          let blogQuery = Stack().contentType('example').entries().query();
        *          let data = blogQuery.greaterThan('created_at','2015-03-12').find()
        *                     data.then(function(result) {
        *                       // result contains the data of entries where the 'created_at' date will be greaterthan '2015-06-22'
        *                     },function (error) {
        *                       // error function
        *                     })
        * @returns {query}
        */
        this.greaterThan = extend.compare('$gt')

        /**
         * @method greaterThanOrEqualTo
         * @description Retrieves entries in which the value for a field is greater than or equal to the provided value.
         * @param {String} key - uid of the field
         * @param {*} value - Value used to match or compare
         * @example let blogQuery = Stack().contentType('example').entries().query();
         *          let data = blogQuery.greaterThanOrEqualTo('created_at','2015-03-12').find()
         *          data.then(function(result) {
         *          // result contains the data of entries where the 'created_at' date will be greaterThan or equalto '2015-06-22'
         *       },function (error) {
         *          // error function
         *      })
         * @returns {query}
         */
        this.greaterThanOrEqualTo = extend.compare('$gte')

        /**
         * @method notEqualTo
         * @description Retrieves entries in which the value for a field does not match the provided value.
         * @param {String} key - uid of the field
         * @param {*} value - Value used to match or compare
         * @example blogQuery.notEqualTo('title','Demo')
         * @example let blogQuery = Stack().contentType('example').entries().query();
         *          let data = blogQuery.notEqualTo('title','Demo').find()
         *          data.then(function(result) {
         *            // ‘result’ contains the list of entries where value of the ‘title’ field will not be 'Demo'.
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.notEqualTo = extend.compare('$ne')

        /**
         * @method containedIn
         * @description Retrieve entries in which the value of a field matches with any of the provided array of values
         * @param {String} key - uid of the field
         * @param {*} value - Array of values that are to be used to match or compare
         * @example let blogQuery = Stack().contentType('example').entries().query();
         *          let data = blogQuery.containedIn('title', ['Demo', 'Welcome']).find()
         *          data.then(function(result) {
         *          // ‘result’ contains the list of entries where value of the ‘title’ field will contain either 'Demo' or ‘Welcome’.
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.containedIn = extend.contained(true)

        /**
          * @method notContainedIn
          * @description Retrieve entries in which the value of a field does not match with any of the provided array of values.
          * @param {String} key - uid of the field
          * @param {Array} value - Array of values that are to be used to match or compare
          * @example let blogQuery = Stack().contentType('example').entries().query();
          *          let data = blogQuery.notContainedIn('title', ['Demo', 'Welcome']).find()
          *          data.then(function(result) {
          *          // 'result' contains the list of entries where value of the title field should not be either "Demo" or ‘Welcome’
          *       },function (error) {
          *          // error function
          *      })
          * @returns {Query}
          */
        this.notContainedIn = extend.contained(false)

        /**
        * @method exists
        * @description Retrieve entries if value of the field, mentioned in the condition, exists.
        * @param {String} key - uid of the field
        * @example blogQuery.exists('featured')
        * @example let blogQuery = Stack().contentType('example').entries().query();
        *          let data = blogQuery.exists('featured').find()
        *          data.then(function(result) {
        *          // ‘result’ contains the list of entries in which "featured" exists.
        *       },function (error) {
        *          // error function
        *      })
        * @returns {Query}
        */
        this.exists = extend.exists(true)

        /**
        * @method notExists
        * @description Retrieve entries if value of the field, mentioned in the condition, does not exists.
        * @param {String} key - uid of the field
        * @example blogQuery.notExists('featured')
        * @example let blogQuery = Stack().contentType('example').entries().query();
        *          let data = blogQuery.notExists('featured').find()
        *          data.then(function(result) {
        *        // result is the list of non-existing’featured’" data.
        *       },function (error) {
        *          // error function
        *      })
        * @returns {Query}
        */
        this.notExists = extend.exists(false)

        /**
        * @method ascending
        * @description Sort fetched entries in the ascending order with respect to a specific field.
        * @param {String} key - field uid based on which the ordering will be done
        * @example let blogQuery = Stack().contentType('example').entries().query();
        *          let data = blogQuery.ascending('created_at').find()
        *          data.then(function(result) {
        *           // ‘result’ contains the list of entries which is sorted in ascending order on the basis of ‘created_at’.
        *       },function (error) {
        *          // error function
        *      })
        * @returns {Query}
        */
        this.ascending = extend.sort('asc')

        /**
         * @method descending
         * @description Sort fetched entries in the descending order with respect to a specific field
         * @param {String} key - field uid based on which the ordering will be done.
         * @example let blogQuery = Stack().contentType('example').entries().query();
         *          let data = blogQuery.descending('created_at').find()
         *          data.then(function(result) {
         *           // ‘result’ contains the list of entries which is sorted in descending order on the basis of ‘created_at’.
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.descending = extend.sort('desc')


        /**
        * @method skip
        * @description Skips at specific number of entries.
        * @param {Number} skip - number of entries to be skipped
        * @example blogQuery.skip(5)
        * @example let blogQuery = Stack().contentType('example').entries().query();
        *          let data = blogQuery.skip(5).find()
        *          data.then(function(result) {
        *          // result contains the list of data which is sorted in descending order on 'created_at' bases.
        *       },function (error) {
        *          // error function
        *      })
        * @returns {Query}
        */
        this.skip = extend.pagination('skip')

        /**
        * @method limit
        * @description Returns a specific number of entries based on the set limit
        * @param {Number} limit - maximum number of entries to be returned
        * @example let blogQuery = Stack().contentType('example').entries().query();
        *          let data = blogQuery.limit(10).find()
        *          data.then(function(result) {
        *          // result contains the limited number of entries
        *       },function (error) {
        *          // error function
        *      })
        * @returns {Query}
        */
        this.limit = extend.pagination('limit')

        /**
        * @method or
        * @description Retrieves entries that satisfy at least one of the given conditions
        * @param {object} queries - array of Query objects or raw queries
        * @example
        * <caption> .or with Query instances</caption>
        * let Query1 = Stack.contentType('blog').entries().where('title', 'Demo').find()
        * let Query2 = Stack.contentType('blog').entries().lessThan('comments', 10).find()
        * blogQuery.or(Query1, Query2)
        * @example
        * <caption> .or with raw queries</caption>
        * let Query1 = Stack.contentType('blog').entries().where('title', 'Demo').getQuery()
        * let Query2 = Stack.contentType('blog').entries().lessThan('comments', 10).getQuery()
        * blogQuery.or(Query1, Query2)
        * @returns {Query}
        */
        this.or = extend.logical('$or')
        this.nor = extend.logical('$nor')
        this.not = extend.logical('$not')

        /**
         * @method and
         * @description Retrieve entries that satisfy all the provided conditions.
         * @param {object} queries - array of query objects or raw queries.
         * @example
         * <caption> .and with Query instances</caption>
         * let Query1 = Stack.contentType('blog').entries().where('title', 'Demo')
         * let Query2 = Stack.contentType('blog').entries().lessThan('comments', 10)
         * blogQuery.and(Query1, Query2)
         * @example
         * <caption> .and with raw queries</caption>
         * let Query1 = Stack.contentType('blog').entries().where('title', 'Demo').getQuery()
         * let Query2 = Stack.contentType('blog').entries().lessThan('comments', 10).getQuery()
         * blogQuery.and(Query1, Query2)
         * @returns {Query}
         */
        this.and = extend.logical('$and')
    }

    /**
     * @method equalTo
     * @description Retrieve entries in which a specific field satisfies the value provided
     * @param {String} key - uid of the field
     * @param {*} value - value used to match or compare
     * @example let blogQuery = Stack().contentType('example').entries();
     *          let data = blogQuery.equalTo('title','Demo').find()
     *          data.then(function(result) {
     *            // ‘result’ contains the list of entries where value of ‘title’ is equal to ‘Demo’.
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */

    public equalTo(key, value) {
        if (key && typeof key === 'string') {
            this.q.query[key] = value
            return this
        } else {
            throw new Error('Kindly provide valid parameters.')
        }
    }

    /**
     * @method where
     * @description Retrieve entries in which a specific field satisfies the value provided
     * @param {String} key - uid of the field
     * @param {*} value - value used to match or compare
     * @example let blogQuery = Stack().contentType('example').entries();
     *          let data = blogQuery.where('title','Demo').find()
     *          data.then(function(result) {
     *            // ‘result’ contains the list of entries where value of ‘title’ is equal to ‘Demo’.
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */

    public where(expr) {
        if (!(expr)) {
            throw new Error('Kindly provide a valid field and expr/fn value for \'.where()\'')
        }
        this.q.query.$where = expr
        return this
    }


    /**
     * @method count
     * @description Returns the total number of entries
     * @example blogQuery.count()
     * @example let blogQuery = Stack().ContentType('example').entries();
     *          let data = blogQuery.count().find()
     *          data.then(function(result) {
     *           // ‘result’ contains the total count.
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */
    public count() {
        this.q.count = true
        return this
    }

    /**
     * @method query
     * @description Retrieve entries based on raw queries
     * @param {object} query - RAW (JSON) queries
     * @returns {Query}
     */
    public query(userQuery) {
        if (typeof userQuery === 'object') {
            this.q.query = mergeDeep(this.q.query, userQuery)
            return this
        } else {
            throw new Error('Kindly provide valid parameters')
        }
    }

    /**
     * @method tags
     * @description Retrieves entries based on the provided tags
     * @param {Array} values - tags
     * @example let blogQuery = Stack().contentType('example').entries();
     *          let data = blogQuery.tags(['technology', 'business']).find()
     *          data.then(function(result) {
     *        // ‘result’ contains list of entries which have tags "’technology’" and ‘"business’".
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */
    public tags(values) {
        if (Array.isArray(values)) {
            this.q.tags = values
            return this
        } else {
            throw new Error('Kindly provide valid parameters')
        }
    }

    /**
     * @method includeCount
     * @description Includes the total number of entries returned in the response.
     * @example blogQuery.includeCount()
     * @example let blogQuery = Stack().contentType('example').entries();
     *          let data = blogQuery.includeCount().find()
     *          data.then(function(result) {
     *         // ‘result’ contains a list of entries in which count of object is present at array[1] position.
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */
    public includeCount() {
        this.q.include_count = true
        return this
    }

    /**
     * @method language
     * @description to retrive the result bsed on the specific locale.
     * @example blogQuery.language()
     * @example let blogQuery = Stack().contentType('example').entries();
     *          let data = blogQuery.language('fr-fr').find()
     *          data.then(function(result) {
     *         // ‘result’ contains a list of entries of locale fr-fr
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */
    public language(language_code) {
        if (language_code && typeof language_code === 'string') {
            this.q.locale = language_code
            return this
        } else {
            throw new Error('Argument should be a String.')
        }
    }

    public includeReferences() {
        this.q.includeReferences = true
        return this
    }

    public excludeReferences() {
        this.q.excludeReferences = true
        return this
    }

    /**
     * @method includeContentType
     * @description Includes the total number of entries returned in the response.
     * @example blogQuery.includeContentType()
     * @example let blogQuery = Stack().contentType('example').entries();
     *          let data = blogQuery.includeContentType().find()
     *          data.then(function(result) {
     *         // ‘result’ contains a list of entries along contentType
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */
    public includeContentType() {
        this.q.include_content_type = true
        return this
    }


    /**
     * @method getQuery
     * @description Returns the raw (JSON) query based on the filters applied on Query object.
     * @example Stack.ContentType('contentType_uid').Query().where('title','Demo').getQuery().find()
     * @returns {Query}
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
     * <caption> .regex without options</caption>
     * blogQuery.regex('title','^Demo')
     * @example
     * <caption> .regex with options</caption>
     * blogQuery.regex('title','^Demo', 'i')
     * @returns {Query}
     */
    public regex(key, value, options = 'g') {
        if (key && value && typeof key === 'string' && typeof value === 'string') {
            this.q.query[key] = {
                $regex: value,
                $options: options
            }
            return this
        } else {
            throw new Error('Kindly provide valid parameters.')
        }
    }

    /**
     * @method only
     * @example blogQuery.only([title,uid])
     * @example let blogQuery = Stack().contentType('example').entries();
     *          let data = blogQuery.only(['title','uid']).find()
     *          data.then(function(result) {
     *         // ‘result’ contains a list of entries with field title and uid only
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
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
     * @example blogQuery.except([title,uid])
     * @example let blogQuery = Stack().contentType('example').entries();
     *          let data = blogQuery.except(['title','uid']).find()
     *          data.then(function(result) {
     *         // ‘result’ contains a list of entries without fields title and uid only
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
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
   * @summary
   *  Wrapper, that allows querying on the entry's references.
   * @note
   *  This is a slow method, since it scans all documents and fires the `reference` query on them
   *  Use `.query()` filters to reduce the total no of documents being scanned
   * @returns {this} - Returns `stack's` instance
   */
    public queryReferences(query) {
        if (query && typeof query === 'object') {
            this.q.queryReferences = query
            return this
        }
        throw new Error('Kindly pass a query object for \'.queryReferences()\'')
    }

    public find() {
        const baseDir = this.baseDir
        const masterLocale = this.masterLocale
        const contentTypeUid = this.content_type_uid
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
                    return reject(`${dataPath} didn't exist`)
                }

                fs.readFile(dataPath, 'utf8', async (err, data) => {
                    if (err) {
                        return reject(err)
                    }


                    const finalResult = {
                        content_type_uid: this.content_type_uid,
                        locale: locale,
                    }

                    let type = (this.type !== 'asset') ? 'entries' : 'assets'
                    if (!data) {
                        finalResult[type] = []
                        return resolve(finalResult)
                    }
                    data = JSON.parse(data)
                    const filteredData = map(data, 'data')

                    if (this.q.queryReferences) {
                        return this.queryOnReferences(filteredData, finalResult, locale, type, schemaPath)
                            .then(resolve)
                            .catch(reject)
                    }

                    if (this.q.excludeReferences) {
                        let preProcessedData = this.preProcess(filteredData)
                        this.postProcessResult(finalResult, preProcessedData, type, schemaPath)
                            .then((result) => {
                                this.q = {}
                                return resolve(result)
                            }).catch(reject)

                    }
                    else {
                        return this.includeReferencesI(filteredData, locale, {}, undefined)
                            .then(async () => {
                                let preProcessedData = this.preProcess(filteredData)
                                this.postProcessResult(finalResult, preProcessedData, type, schemaPath).then((result) => {
                                    this.q = {}
                                    return resolve(result)
                                })
                            })
                            .catch(reject)
                    }

                })

            } catch (error) {
                return reject(error)

            }
        })

    }

    private queryOnReferences(filteredData, finalResult, locale, type, schemaPath) {
        return new Promise((resolve, reject) => {

            return this.includeReferencesI(filteredData, locale, {}, undefined)
                .then(async () => {
                    let result = sift(this.q.queryReferences, filteredData)
                    let preProcessedData = this.preProcess(result)
                    this.postProcessResult(finalResult, preProcessedData, type, schemaPath).then((res) => {
                        this.q = {}
                        return resolve(res)
                    })

                })
                .catch(reject)

        })
    }

    public findOne() {
        this.single = true
        return new Promise((resolve, reject) => {
            this.find().then((result) => {
                return resolve(result)
            }).catch((error) => {
                return reject(error)
            })
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
                    if (entry[prop] && entry[prop].reference_to && ((!(this.includeReferences)
                        && entry[prop].reference_to === '_assets') || this.includeReferences)) {
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
                                    uid: {
                                        $in: uids,
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
                                            references[parentUid] = uniq(references[parentUid].concat(map((entities as any), 'uid')))
                                        }
                                        if (typeof entry[prop].values === 'string') {
                                            entry[prop] = ((entities === null) || (entities as any).length === 0) ? null : entities[0]
                                        } else {
                                            // format the references in order
                                            const referenceBucket = []
                                            query.uid.$in.forEach((entityUid) => {
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
        let result
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
            result = orderBy(filteredData, value, key)
        }

        if (this.q.query && Object.keys(this.q.query).length > 0) {
            result = sift(this.q.query, filteredData)
        } else if (this.q.logical) {
            const operator = Object.keys(this.q.logical)[0]
            const vals: any = (Object as any).values(this.q.logical)
            const values = JSON.parse(JSON.stringify(vals).replace(/\,/, '},{'))
            const logicalQuery = {}
            logicalQuery[operator] = values
            result = sift(logicalQuery, filteredData)
        } else {
            result = filteredData
        }

        if ((this.q.skip) && ((this.q.limit))) {
            result = result.splice(this.q.skip, this.q.limit)
        } else if ((this.q.skip)) {
            result = result.slice(this.q.skip)
        } else if (this.q.limit) {
            result = result.splice(0, this.q.limit)
        }

        if (this.q.only) {
            const only = this.q.only.toString().replace(/\./g, '/')
            result = mask(result, only)
        }

        if (this.q.except) {
            const bukcet = this.q.except.toString().replace(/\./g, '/')
            const except = mask(result, bukcet)
            result = difference(result, except)
        }

        if (this.q.tags) {
            result = sift({
                tags: {
                    $in: this.q.tags,
                },
            }, result)
        }

        return result
    }

    private postProcessResult(finalResult, result, type, schemaPath) {
        return new Promise((resolve, reject) => {
            try {
                if (this.q.count) {
                    (finalResult as any).count = result.length
                } else {
                    finalResult[type] = result
                }

                if (this.single) {
                    finalResult[type] = result[0]
                }

                if (this.q.include_count) {
                    if (result === undefined) {
                        (finalResult as any).count = 0
                    } else if (this.single) {
                        (finalResult as any).count = 1
                    } else {
                        (finalResult as any).count = result.length
                    }
                }

                if (this.q.include_content_type) {
                    if (!fs.existsSync(schemaPath)) {
                        return reject(`content type not found`)
                    }
                    let contents
                    readFile(schemaPath).then((data) => {
                        contents = JSON.parse(data);
                        (finalResult as any).content_type = contents
                        return resolve(finalResult)
                    }).catch(() => {
                        (finalResult as any).content_type = null
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
