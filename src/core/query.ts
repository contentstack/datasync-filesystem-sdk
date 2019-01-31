import * as fs from 'fs'
import { default as mask } from 'json-mask'
import { find, uniq, map, orderBy, filter } from 'lodash'
import * as path from 'path'
import { default as sift } from 'sift'
import { checkCyclic, difference, mergeDeep } from './utils'

const _extend = {
    compare(type) {
        return function (key, value) {
            if (key && value && typeof key === 'string' && typeof value !== 'undefined') {
                this._query.query = this._query.query || {}
                this._query.query[key] = this._query.query.file_size || {}
                this._query.query[key][type] = value
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
                this._query.query = this._query.query || {}
                this._query.query[key] = this._query.query[key] || {}
                this._query.query[key][type] = this._query.query[key][type] || []
                this._query.query[key][type] = this._query.query[key][type].concat(value)
                return this
            } else {
                console.error('Kindly provide valid parameters.')
            }
        }
    },
    exists(bool) {
        return function (key) {
            if (key && typeof key === 'string') {
                this._query.query = this._query.query || {}
                this._query.query[key] = this._query.query[key] || {}
                this._query.query[key].$exists = bool
                return this
            } else {
                console.error('Kindly provide valid parameters.')
            }
        }
    },
    logical(type) {
        return function () {
            this._query.logical = this._query.logical || {}
            this._query.logical[type] = this._query.logical[type] || {}
            this._query.logical[type] = this._query.query
            delete this._query.query
            return this
        }
    },
    sort(type) {
        return function (key) {
            if (key && typeof key === 'string') {
                this._query[type] = key
                return this
            } else {
                console.error('Argument should be a string.')
            }
        }
    },
    pagination(type) {
        return function (value) {
            if (typeof value === 'number') {
                this._query[type] = value
                return this
            } else {
                console.error('Argument should be a number.')
            }
        }
    },
}

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
    private _query: any
    type: string;
    single: boolean = false;

    constructor() {
        this._query = this._query || {}
        this._query.query = this._query.query || {}

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
        this.lessThan = _extend.compare('$lt')

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
        this.lessThanOrEqualTo = _extend.compare('$lte')

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
        this.greaterThan = _extend.compare('$gt')

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
        this.greaterThanOrEqualTo = _extend.compare('$gte')

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
        this.notEqualTo = _extend.compare('$ne')

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
        this.containedIn = _extend.contained(true)

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
        this.notContainedIn = _extend.contained(false)

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
        this.exists = _extend.exists(true)

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
        this.notExists = _extend.exists(false)

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
        this.ascending = _extend.sort('asc')

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
        this.descending = _extend.sort('desc')


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
        this.skip = _extend.pagination('skip')

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
        this.limit = _extend.pagination('limit')

        /**
        * @method or
        * @description Retrieves entries that satisfy at least one of the given conditions
        * @param {object} queries - array of Query objects or raw queries
        * @example
        * <caption> .or with Query instances</caption>
        * let Query1 = Stack.contentType('blog').entries().query().where('title', 'Demo').find()
        * let Query2 = Stack.contentType('blog').entries().query().lessThan('comments', 10).find()
        * blogQuery.or(Query1, Query2)
        * @example
        * <caption> .or with raw queries</caption>
        * let Query1 = Stack.contentType('blog').entries().query().where('title', 'Demo').getQuery()
        * let Query2 = Stack.contentType('blog').entries().query().lessThan('comments', 10).getQuery()
        * blogQuery.or(Query1, Query2)
        * @returns {Query}
        */
        this.or = _extend.logical('$or')
        this.nor = _extend.logical('$nor')
        this.not = _extend.logical('$not')

        /**
         * @method and
         * @description Retrieve entries that satisfy all the provided conditions.
         * @param {object} queries - array of query objects or raw queries.
         * @example
         * <caption> .and with Query instances</caption>
         * let Query1 = Stack.contentType('blog').entries().query().where('title', 'Demo')
         * let Query2 = Stack.contentType('blog').entries().query().lessThan('comments', 10)
         * blogQuery.and(Query1, Query2)
         * @example
         * <caption> .and with raw queries</caption>
         * let Query1 = Stack.contentType('blog').entries().query().where('title', 'Demo').getQuery()
         * let Query2 = Stack.contentType('blog').entries().query().lessThan('comments', 10).getQuery()
         * blogQuery.and(Query1, Query2)
         * @returns {Query}
         */
        this.and = _extend.logical('$and')
    }


    public equalTo(key, value) {
        if (key && typeof key === 'string') {
            this._query.query = this._query.query || {}
            this._query.query[key] = value

            return this
        } else {
            return console.error('Kindly provide valid parameters.')
        }
    }

    /**
     * @method where
     * @description Retrieve entries in which a specific field satisfies the value provided
     * @param {String} key - uid of the field
     * @param {*} value - value used to match or compare
     * @example let blogQuery = Stack().contentType('example').entries().query();
     *          let data = blogQuery.where('title','Demo').find()
     *          data.then(function(result) {
     *            // ‘result’ contains the list of entries where value of ‘title’ is equal to ‘Demo’.
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */

    public where(key, value) {
        if (key && typeof key === 'string') {
            this._query.query = this._query.query || {}
            this._query.query[key] = value
            return this
        } else {
            return console.error('Kindly provide valid parameters.')
        }
    }

    /**
     * @method count
     * @description Returns the total number of entries
     * @example blogQuery.count()
     * @example let blogQuery = Stack().ContentType('example').Query();
     *          let data = blogQuery.count().find()
     *          data.then(function(result) {
     *           // ‘result’ contains the total count.
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */
    public count() {
        this._query.count = true
        return this
    }

    /**
     * @method query
     * @description Retrieve entries based on raw queries
     * @param {object} query - RAW (JSON) queries
     * @returns {Query}
     */
    public query(query) {
        if (typeof query === 'object') {
            this._query.query = mergeDeep(this._query.query, query)
            return this
        } else {
            return console.error('Kindly provide valid parameters')
        }
    }

    /**
     * @method tags
     * @description Retrieves entries based on the provided tags
     * @param {Array} values - tags
     * @example let blogQuery = Stack().ContentType('example').Query();
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
            this._query.tags = values
            return this
        } else {
            return console.error('Kindly provide valid parameters')
        }
    }

    /**
     * @method includeCount
     * @description Includes the total number of entries returned in the response.
     * @example blogQuery.includeCount()
     * @example let blogQuery = Stack().ContentType('example').Query();
     *          let data = blogQuery.includeCount().find()
     *          data.then(function(result) {
     *         // ‘result’ contains a list of entries in which count of object is present at array[1] position.
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */
    public includeCount() {
        this._query.include_count = true
        return this
    }

    public language(language_code) {
        if (language_code && typeof language_code === 'string') {
            this._query.locale = language_code
            return this
        } else {
            return console.error('Argument should be a String.')
        }
    }

    public includeReferences() {
        this._query.includeReferences = true
        return this
    }

    public includeContentType() {
        this._query.include_content_type = true
        return this
    }

    public addParam(key, value) {
        if (key && value && typeof key === 'string' && typeof value === 'string') {
            this._query[key] = value
            return this
        } else {
            return console.error('Kindly provide valid parameters.')
        }
    }

    /**
     * @method getQuery
     * @description Returns the raw (JSON) query based on the filters applied on Query object.
     * @example Stack.ContentType('contentType_uid').Query().where('title','Demo').getQuery().find()
     * @returns {Query}
     */
    public getQuery() {
        return this._query.query || {}
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
    public regex(key, value, options) {
        if (key && value && typeof key === 'string' && typeof value === 'string') {
            this._query.query[key] = {
                $regex: value,
            }
            if (options) { this._query.query[key].$options = options }
            return this
        } else {
            return console.error('Kindly provide valid parameters.')
        }
    }

    public only(fields) {
        if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'only()\'')
        }
        this._query.query = this._query.query || {}
        this._query.only = this._query.only || {}
        this._query.only = fields

        return this
    }

    public except(fields) {
        if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'except()\'')
        }
        this._query.query = this._query.query || {}
        this._query.except = this._query.except || {}
        this._query.except = fields

        return this
    }

    public find() {
        const baseDir = this.baseDir
        const masterLocale = this.masterLocale
        const contentTypeUid = this.content_type_uid
        const locale = (!this._query.locale)? masterLocale : this._query.locale
        let result
        return new Promise((resolve, reject) => {
            let dataPath
            if (this.type === 'asset') {
                dataPath = (!this._query.locale) ? path.join(baseDir, masterLocale, 'assets', '_assets.json') : path.join(baseDir, this._query.locale, 'assets', '_assets.json')
            } else {
                dataPath = (!this._query.locale) ? path.join(baseDir, masterLocale, 'data', contentTypeUid, 'index.json') : path.join(baseDir, this._query.locale, 'data', contentTypeUid, 'index.json')
            }

            if (!fs.existsSync(dataPath)) {
                return reject(`${dataPath} didn't exist`)
            } else {
                fs.readFile(dataPath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(err)
                    } else {
                        const entryData = JSON.parse(data)
                        let filteredEntryData = map(entryData, 'data')
                        let type = "assets"
                        if (this.type !== 'asset') {
                            type = "entries"
                        }

                        if (this._query.includeReferences) {
                            return this.includeReferencesI(filteredEntryData, locale, {}, undefined)
                                .then(() => {
                                    const sortKeys: any = ['asc', 'desc']
                                    // Good implementation @sortQuery
                                    const sortQuery: any = Object.keys(this._query)
                                        .filter((key) => sortKeys.includes(key))
                                        .reduce((obj, key) => {
                                            return {
                                                ...obj,
                                                [key]: this._query[key],
                                            }
                                        }, {})
                                    if (this._query.asc || this._query.desc) {
                                        const value: any = (Object as any).values(sortQuery)
                                        const key: any = Object.keys(sortQuery)
                                        result = orderBy(filteredEntryData, value, key)
                                    }

                                    if (this._query.query && Object.keys(this._query.query).length > 0) {
                                        result = sift(this._query.query, filteredEntryData)
                                    } else if (this._query.logical) {
                                        const operator = Object.keys(this._query.logical)[0]
                                        const vals: any = (Object as any).values(this._query.logical)
                                        const values = JSON.parse(JSON.stringify(vals).replace(/\,/, '},{'))
                                        const logicalQuery = {}
                                        logicalQuery[operator] = values
                                        result = sift(logicalQuery, filteredEntryData)
                                    } else {
                                        result = filteredEntryData
                                    }

                                    // Bug: Check implementation @skip/limit
                                    if (this._query.limit && this._query.limit < result.length) {
                                        const limit = this._query.limit
                                        result = result.splice(0, limit)
                                    }

                                    if (this._query.skip) {
                                        const skip = this._query.skip
                                        result = result.splice(0, skip)
                                    }

                                    if (this._query.only) {
                                        const only = this._query.only.toString().replace(/\./g, '/')
                                        result = mask(result, only)
                                    }

                                    if (this._query.except) {
                                        const bukcet = this._query.except.toString().replace(/\./g, '/')
                                        const except = mask(result, bukcet)
                                        result = difference(result, except)
                                    }

                                    //let finalRes={}
                                    let finalRes = {
                                        content_type_uid: entryData[0].content_type_uid,
                                        locale: entryData[0].locale
                                    }
                                    // Misc: count() in itself is a method, and not part of find()
                                    if (this._query.count) {
                                        finalRes['count'] = result.length
                                    } else {
                                        finalRes[type] = result
                                    }

                                    if (this._query.include_count) {
                                        finalRes['count'] = result.length
                                    }
                                    if (this._query.include_content_type) {
                                        finalRes['content_type'] = entryData[0].content_type
                                    }

                                    if (this._query.tags) {
                                        result = sift({
                                            tags: {
                                                $in: this._query.tags
                                            }
                                        }, result)
                                        finalRes[type] = result
                                        finalRes['count'] = result.length
                                    }

                                    return resolve(finalRes)
                                })
                                .catch(reject)
                        }




                        const sortKeys: any = ['asc', 'desc']
                        const sortQuery: any = Object.keys(this._query)
                            .filter((key) => sortKeys.includes(key))
                            .reduce((obj, key) => {
                                return {
                                    ...obj,
                                    [key]: this._query[key],
                                }
                            }, {})

                        if (this._query.asc || this._query.desc) {
                            const value: any = (Object as any).values(sortQuery)
                            const key: any = Object.keys(sortQuery)
                            result = orderBy(filteredEntryData, value, key)
                        }

                        if (this._query.query && Object.keys(this._query.query).length > 0) {
                            result = sift(this._query.query, filteredEntryData)
                        } else if (this._query.logical) {
                            const operator = Object.keys(this._query.logical)[0]
                            const vals: any = (Object as any).values(this._query.logical)
                            const values = JSON.parse(JSON.stringify(vals).replace(/\,/, '},{'))
                            const logicalQuery = {}
                            logicalQuery[operator] = values
                            result = sift(logicalQuery, filteredEntryData)
                        } else {
                            result = filteredEntryData
                        }

                        if (this._query.limit && this._query.limit < result.length) {
                            const limit = this._query.limit
                            result = result.splice(0, limit)
                        }

                        if (this._query.skip) {
                            const skip = this._query.skip
                            result = result.splice(0, skip)
                        }

                        if (this._query.only) {
                            const only = this._query.only.toString().replace(/\./g, '/')
                            result = mask(result, only)
                        }

                        if (this._query.except) {
                            const bukcet = this._query.except.toString().replace(/\./g, '/')
                            const except = mask(result, bukcet)
                            result = difference(result, except)
                        }

                        let finalRes = {
                            content_type_uid: entryData[0].content_type_uid,
                            locale: entryData[0].locale
                        }

                        if (this.single) {
                            result = result[0]
                            type = "entry"
                        }

                        if (this._query.count) {
                            finalRes['count'] = result.length
                        } else {
                            finalRes[type] = result
                        }

                        if (this._query.include_count) {
                            if (result === undefined) {
                                finalRes['count'] = 0
                            } else if (this.single) {
                                finalRes['count'] = 1
                            } else {
                                finalRes['count'] = result.length
                            }
                        }

                        if (this._query.include_content_type) {
                            finalRes['content_type'] = entryData[0].content_type
                        }

                        if (this._query.tags) {
                            result = sift({ tags: { $in: this._query.tags } }, result)
                            finalRes[type] = result
                            finalRes['count'] = result.length
                        }

                        resolve(finalRes)
                    }
                })
            }
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

    private findReferences(_query) {
        return new Promise((resolve, reject) => {
            let pth
            if (_query.content_type_uid === 'asset') {
                pth = path.join(this.baseDir, _query.locale, 'assets', '_assets.json')
            } else {
                pth = path.join(this.baseDir,_query.locale, 'data', _query.content_type_uid, 'index.json')
            }
            if (!fs.existsSync(pth)) {
                return resolve([])
            }
            return fs.readFile(pth, 'utf-8', (readError, data) => {
                if (readError) {
                    return reject(readError)
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
                    if (entry[prop] && entry[prop].reference_to) {
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
                                        if ((entities as any).length === 0) {
                                            entry[prop] = []

                                            return rs()
                                        } else if (parentUid) {
                                            references[parentUid] = references[parentUid] || []
                                            references[parentUid] = uniq(references[parentUid].concat(map(entry[prop], 'uid')))
                                        }
                                        const referenceBucket = []
                                        query.uid.$in.forEach((entityUid) => {
                                            const elem = find(entities, (entity) => {
                                                return (entity as any).uid === entityUid
                                            })
                                            if (elem) {
                                                referenceBucket.push(elem)
                                            }
                                        })
                                        // format the references in order
                                        entry[prop] = entities

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

}


