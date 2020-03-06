"use strict";
/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_mask_1 = __importDefault(require("json-mask"));
const lodash_1 = require("lodash");
const sift_1 = __importDefault(require("sift"));
const fs_1 = require("./fs");
const utils_1 = require("./utils");
const extend = {
    compare(type) {
        return function (key, value) {
            if (typeof key === 'string' && typeof value !== 'undefined') {
                this.q.query = this.q.query || {};
                this.q.query[key] = this.q.query[key] || {};
                this.q.query[key][type] = value;
                return this;
            }
            throw new Error(`Kindly provide valid parameters for ${type}`);
        };
    },
    contained(bool) {
        const type = (bool) ? '$in' : '$nin';
        return function (key, value) {
            if (typeof key === 'string' && typeof value === 'object' && Array.isArray(value)) {
                this.q.query = this.q.query || {};
                this.q.query[key] = this.q.query[key] || {};
                this.q.query[key][type] = this.q.query[key][type] || [];
                this.q.query[key][type] = this.q.query[key][type].concat(value);
                return this;
            }
            throw new Error(`Kindly provide valid parameters for ${bool}`);
        };
    },
    exists(bool) {
        return function (key) {
            if (key && typeof key === 'string') {
                this.q.query = this.q.query || {};
                this.q.query[key] = this.q.query[key] || {};
                this.q.query[key].$exists = bool;
                return this;
            }
            throw new Error(`Kindly provide valid parameters for ${bool}`);
        };
    },
    // TODO
    logical(type) {
        return function (query) {
            this.q.query = this.q.query || {};
            this.q.query[type] = query;
            return this;
        };
    },
    sort(type) {
        return function (key) {
            if (key && typeof key === 'string') {
                this.q[type] = key;
                return this;
            }
            throw new Error(`Kindly provide valid parameters for sort-${type}`);
        };
    },
    pagination(type) {
        return function (value) {
            if (typeof value === 'number') {
                this.q[type] = value;
                return this;
            }
            throw new Error('Argument should be a number.');
        };
    },
};
/**
 * @summary
 *  Expose SDK query methods on Stack
 * @returns {this} - Returns `stack's` instance
 */
class Stack {
    constructor(config) {
        // app config
        this.config = config;
        this.contentStore = config.contentStore;
        this.projections = Object.keys(this.contentStore.projections);
        this.types = config.contentStore.internal.types;
        this.q = this.q || {};
        this.q.query = this.q.query || {};
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
        this.lessThan = extend.compare('$lt');
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
        this.lessThanOrEqualTo = extend.compare('$lte');
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
        this.greaterThan = extend.compare('$gt');
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
        this.greaterThanOrEqualTo = extend.compare('$gte');
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
        this.notEqualTo = extend.compare('$ne');
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
        this.containedIn = extend.contained(true);
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
        this.notContainedIn = extend.contained(false);
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
        this.exists = extend.exists(true);
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
        this.notExists = extend.exists(false);
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
        this.ascending = extend.sort('asc');
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
        this.descending = extend.sort('desc');
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
        this.skip = extend.pagination('skip');
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
        this.limit = extend.pagination('limit');
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
        this.or = extend.logical('$or');
        this.nor = extend.logical('$nor');
        this.not = extend.logical('$not');
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
        this.and = extend.logical('$and');
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
    connect(overrides = {}) {
        this.config = lodash_1.merge(this.config, overrides);
        return Promise.resolve(this.config);
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
    contentType(uid) {
        if (typeof uid !== 'string' || uid.length === 0) {
            throw new Error('Kindly provide a uid for .contentType()');
        }
        const stack = new Stack(this.config);
        stack.q.content_type_uid = uid;
        return stack;
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
    entries() {
        if (typeof this.q.content_type_uid === 'undefined') {
            throw new Error('Please call .contentType() before calling .entries()!');
        }
        return this;
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
    entry(uid) {
        this.q.isSingle = true;
        if (typeof this.q.content_type_uid === 'undefined') {
            throw new Error('Please call .contentType() before calling .entries()!');
        }
        if (uid && typeof uid === 'string') {
            this.q.query.uid = uid;
        }
        return this;
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
    asset(uid) {
        const stack = new Stack(this.config);
        stack.q.isSingle = true;
        stack.q.content_type_uid = stack.types.assets;
        if (uid && typeof uid === 'string') {
            stack.q.query.uid = uid;
        }
        return stack;
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
    assets() {
        const stack = new Stack(this.config);
        stack.q.content_type_uid = stack.types.assets;
        return stack;
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
    schemas() {
        const stack = new Stack(this.config);
        stack.q.content_type_uid = stack.types.content_types;
        return stack;
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
    contentTypes() {
        const stack = new Stack(this.config);
        stack.q.content_type_uid = stack.types.content_types;
        return stack;
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
    schema(uid) {
        const stack = new Stack(this.config);
        stack.q.isSingle = true;
        stack.q.content_type_uid = stack.types.content_types;
        if (uid && typeof uid === 'string') {
            stack.q.query.uid = uid;
        }
        return stack;
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
    equalTo(key, value) {
        if (!key || typeof key !== 'string' && typeof value === 'undefined') {
            throw new Error('Kindly provide valid parameters for .equalTo()!');
        }
        this.q.query[key] = value;
        return this;
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
    where(expr) {
        if (!expr) {
            throw new Error('Kindly provide a valid field and expr/fn value for \'.where()\'');
        }
        this.q.query.$where = expr;
        return this;
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
    count() {
        this.q.countOnly = 'count';
        return this.find();
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
    query(userQuery) {
        if (!userQuery || typeof userQuery !== 'object') {
            throw new Error('Kindly provide valid parameters for \'.query()\'');
        }
        this.q.query = lodash_1.merge(this.q.query, userQuery);
        return this;
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
    tags(values) {
        if (values && typeof values === 'object' && values instanceof Array) {
            if (values.length === 0) {
                this.q.query.tags = {
                    $size: 0,
                };
            }
            else {
                this.q.query.tags = {
                    $in: values,
                };
            }
            return this;
        }
        throw new Error('Kindly provide valid parameters for \'.tags()\'');
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
    includeCount() {
        this.q.includeCount = true;
        return this;
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
    language(languageCode) {
        if (!languageCode || typeof languageCode !== 'string') {
            throw new Error(`${languageCode} should be of type string and non-empty!`);
        }
        this.q.locale = languageCode;
        return this;
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
     * @returns {this} - Returns `stack's` instance
     */
    include(fields) {
        if (fields && typeof fields === 'object' && fields instanceof Array && fields.length) {
            this.q.includeSpecificReferences = fields;
        }
        else if (fields && typeof fields === 'string') {
            this.q.includeSpecificReferences = [fields];
        }
        else {
            throw new Error('Kindly pass \'string\' OR \'array\' fields for .include()!');
        }
        return this;
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
    includeReferences(depth) {
        console.warn('.includeReferences() is a relatively slow query..!');
        this.q.includeAllReferences = true;
        if (typeof depth === 'number') {
            this.q.referenceDepth = depth;
        }
        return this;
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
    excludeReferences() {
        this.q.excludeAllReferences = true;
        return this;
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
    includeContentType() {
        this.q.include_content_type = true;
        return this;
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
    getQuery() {
        return this.q.query;
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
    regex(key, value, options = 'g') {
        if (key && value && typeof key === 'string' && typeof value === 'string') {
            this.q.query[key] = {
                $options: options,
                $regex: value,
            };
            return this;
        }
        throw new Error('Kindly provide valid parameters for .regex()!');
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
    only(fields) {
        if (fields && typeof fields === 'object' && fields instanceof Array && fields.length) {
            this.q.only = [];
            fields.forEach((field) => {
                if (typeof field === 'string') {
                    this.q.only.push(field);
                }
            });
            return this;
        }
        throw new Error('Kindly provide valid parameters for .except()!');
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
    except(fields) {
        if (fields && typeof fields === 'object' && fields instanceof Array && fields.length) {
            this.q.except = [];
            fields.forEach((field) => {
                if (typeof field === 'string') {
                    this.q.except.push(field);
                }
            });
            return this;
        }
        throw new Error('Kindly provide valid parameters for .except()!');
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
    queryReferences(query) {
        if (!query || typeof query !== 'object') {
            throw new Error('Kindly valid parameters for \'.queryReferences()\'!');
        }
        this.q.queryOnReferences = query;
        return this;
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
    referenceDepth(depth) {
        if (typeof depth !== 'number') {
            throw new Error('Kindly valid parameters for \'.referenceDepth()\'!');
        }
        this.q.referenceDepth = depth;
        if (depth > this.contentStore.referenceDepth) {
            console.warn(`Increasing reference depth above ${this.contentStore.referenceDepth} may degrade performance!`);
        }
        return this;
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
    find() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { filePath, key, locale, } = this.preProcess();
                let data = yield fs_1.readFile(filePath);
                const count = data.length;
                data = data.filter(sift_1.default(this.q.query));
                if (data.length === 0 || this.q.content_type_uid === this.types.content_types || this.q.content_type_uid ===
                    this.types.assets || this.q.countOnly || this.q.excludeAllReferences) {
                    // do nothing
                }
                else if (this.q.includeSpecificReferences) {
                    yield this
                        .includeSpecificReferences(data, this.q.content_type_uid, locale, this.q
                        .includeSpecificReferences);
                }
                else if (this.q.includeAllReferences) {
                    yield this.bindReferences(data, this.q.content_type_uid, locale);
                }
                else {
                    yield this.includeAssetsOnly(data, locale, this.q.content_type_uid);
                }
                if (this.q.queryOnReferences) {
                    data = data.filter(sift_1.default(this.q.queryOnReferences));
                }
                const { output } = yield this.postProcess(data, key, locale, count);
                return resolve(output);
            }
            catch (error) {
                return reject(error);
            }
        }));
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
    findOne() {
        this.q.isSingle = true;
        return this.find();
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
    fetch() {
        this.q.isSingle = true;
        return this.find();
    }
    /**
     * @private
     * @method preProcess
     * @description
     * Runs before .find()
     * Formats the queries/sets defaults and returns the locale, key & filepath of the data
     * @returns {object} - Returns the query's key, locale & filepath of the data
     */
    preProcess() {
        const locale = (typeof this.q.locale === 'string') ? this.q.locale : this.contentStore.locale;
        let key;
        let filePath;
        switch (this.q.content_type_uid) {
            case this.types.assets:
                filePath = utils_1.getAssetsPath(locale) + '.json';
                key = (this.q.isSingle) ? 'asset' : 'assets';
                break;
            case this.types.content_types:
                filePath = utils_1.getContentTypesPath(locale) + '.json';
                key = (this.q.isSingle) ? 'content_type' : 'content_types';
                break;
            default:
                filePath = utils_1.getEntriesPath(locale, this.q.content_type_uid) + '.json';
                key = (this.q.isSingle) ? 'entry' : 'entries';
                break;
        }
        if (!fs_1.existsSync(filePath)) {
            throw new Error(`Queried content type ${this.q.content_type_uid} was not found at ${filePath}!`);
        }
        if (!this.q.hasOwnProperty('asc') && !this.q.hasOwnProperty('desc')) {
            this.q.desc = this.contentStore.defaultSortingField;
        }
        if (!this.q.hasOwnProperty('except') && !this.q.hasOwnProperty('only')) {
            const keys = Object.keys(this.contentStore.projections);
            this.q.except = keys;
        }
        this.q.referenceDepth = (typeof this.q.referenceDepth === 'number') ? this.q.referenceDepth : this.contentStore
            .referenceDepth;
        return {
            filePath,
            key,
            locale,
        };
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
    postProcess(data, key, locale, count) {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line: variable-name
            const content_type_uid = (this.q.content_type_uid === this.types.assets) ? 'assets' : (this.q.content_type_uid ===
                this.types.content_types ? 'content_types' : this.q.content_type_uid);
            const output = {
                content_type_uid,
                locale,
            };
            if (this.q.countOnly) {
                output.count = data.length;
                return { output };
            }
            if (this.q.include_content_type) {
                // ideally, if the content type doesn't exist, an error will be thrown before it reaches this line
                const contentTypes = yield fs_1.readFile(utils_1.getContentTypesPath(locale) + '.json');
                for (let i = 0, j = contentTypes.length; i < j; i++) {
                    if (contentTypes[i].uid === this.q.content_type_uid) {
                        output.content_type = contentTypes[i];
                        break;
                    }
                }
            }
            if (this.q.includeCount) {
                output.count = count;
            }
            if (this.q.isSingle) {
                data = (data.length) ? data[0] : null;
                if (this.q.only) {
                    const only = this.q.only.toString().replace(/\./g, '/');
                    data = json_mask_1.default(data, only);
                }
                else if (this.q.except) {
                    const bukcet = this.q.except.toString().replace(/\./g, '/');
                    const except = json_mask_1.default(data, bukcet);
                    data = utils_1.difference(data, except);
                }
                output[key] = /* (data.length) ? data[0] : null */ data;
                return { output };
            }
            if (this.q.hasOwnProperty('asc')) {
                data = lodash_1.sortBy(data, this.q.asc);
            }
            else if (this.q.hasOwnProperty('desc')) {
                const temp = lodash_1.sortBy(data, this.q.desc);
                data = lodash_1.reverse(temp);
            }
            if (this.q.skip) {
                data.splice(0, this.q.skip);
            }
            if (this.q.limit) {
                data = data.splice(0, this.q.limit);
            }
            if (this.q.only) {
                const bukcet = JSON.parse(JSON.stringify(data));
                this.q.only.forEach((field) => {
                    const splittedField = field.split('.');
                    bukcet.forEach((obj) => {
                        if (obj.hasOwnProperty(field)) {
                            delete obj[field];
                        }
                        else {
                            const depth = 0;
                            const parent = '';
                            utils_1.applyProjections(obj, splittedField, depth, parent);
                        }
                    });
                });
                data = utils_1.difference(data, bukcet);
            }
            else if (this.q.except) {
                this.q.except.forEach((field) => {
                    const splittedField = field.split('.');
                    data.forEach((obj) => {
                        if (obj.hasOwnProperty(field)) {
                            delete obj[field];
                        }
                        else {
                            const depth = 0;
                            const parent = '';
                            utils_1.applyProjections(obj, splittedField, depth, parent);
                        }
                    });
                });
            }
            output[key] = data;
            return { output };
        });
    }
    includeSpecificReferences(entries, contentTypeUid, locale, include) {
        return __awaiter(this, void 0, void 0, function* () {
            const ctQuery = {
                _content_type_uid: this.types.content_types,
                uid: contentTypeUid,
            };
            const { paths, // ref. fields in the current content types
            pendingPath, // left over of *paths*
            schemaList, } = yield this.getReferencePath(ctQuery, locale, include);
            const queries = {
                $or: [],
            }; // reference field paths
            const shelf = []; // a mapper object, that holds pointer to the original element
            // iterate over each path in the entries and fetch the references
            // while fetching, keep track of their location
            for (let i = 0, j = paths.length; i < j; i++) {
                // populates shelf and queries
                this.fetchPathDetails(entries, locale, paths[i].split('.'), queries, shelf, true, entries, 0);
            }
            // even after traversing, if no references were found, simply return the entries found thusfar
            if (shelf.length === 0) {
                return;
            }
            // else, self-recursively iterate and fetch references
            // Note: Shelf is the one holding `pointers` to the actual entry
            // Once the pointer has been used, for GC, point the object to null
            yield this.includeReferenceIteration(queries, schemaList, locale, pendingPath, shelf);
            return;
        });
    }
    includeReferenceIteration(eQuery, ctQuery, locale, include, oldShelf) {
        return __awaiter(this, void 0, void 0, function* () {
            if (oldShelf.length === 0) {
                return;
            }
            else if (ctQuery.$or.length === 0 && eQuery.$or.length > 0) {
                yield this.bindLeftoverAssets(eQuery, locale, oldShelf);
                return;
            }
            const { paths, pendingPath, schemaList, } = yield this.getReferencePath(ctQuery, locale, include);
            const queries = {
                $or: [],
            };
            let result = {
                docs: [],
            };
            const shelf = [];
            yield this.subIncludeReferenceIteration(eQuery, locale, paths, include, queries, result, shelf);
            // GC to avoid mem leaks!
            eQuery = null;
            for (let i = 0, j = oldShelf.length; i < j; i++) {
                const element = oldShelf[i];
                let flag = true;
                for (let k = 0, l = result.docs.length; k < l; k++) {
                    if (result.docs[k].uid === element.uid) {
                        element.path[element.position] = result.docs[k];
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    for (let e = 0, f = oldShelf[i].path.length; e < f; e++) {
                        // tslint:disable-next-line: max-line-length
                        if (oldShelf[i].path[e].hasOwnProperty('_content_type_uid') && Object.keys(oldShelf[i].path[e]).length === 2) {
                            oldShelf[i].path.splice(e, 1);
                            break;
                        }
                    }
                }
            }
            // GC to avoid mem leaks!
            oldShelf = null;
            result = null;
            // Iterative loops, that traverses paths and binds them onto entries
            yield this.includeReferenceIteration(queries, schemaList, locale, pendingPath, shelf);
            return;
        });
    }
    subIncludeReferenceIteration(eQuieries, locale, paths, include, queries, result, shelf) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contentTypes, aggQueries, } = utils_1.segregateQueries(eQuieries.$or);
            const promises = [];
            contentTypes.forEach((contentType) => {
                promises.push(this.fetchDocuments(aggQueries[contentType], locale, contentType, paths, include, queries, result, shelf));
            });
            // wait for all promises to be resolved
            yield Promise.all(promises);
            return {
                queries,
                result,
                shelf,
            };
        });
    }
    getReferencePath(query, locale, currentInclude) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fs_1.readFile(utils_1.getContentTypesPath(locale) + '.json');
            const schemas = data.filter(sift_1.default(query));
            const pendingPath = [];
            const schemasReferred = [];
            const paths = [];
            const schemaList = {
                $or: [],
            };
            if (schemas.length === 0) {
                return {
                    paths,
                    pendingPath,
                    schemaList,
                };
            }
            let entryReferences = {};
            schemas.forEach((schema) => {
                // Entry references
                entryReferences = lodash_1.merge(entryReferences, schema[this.types.references]);
                // tslint:disable-next-line: forin
                for (const path in schema[this.types.assets]) {
                    paths.push(path);
                }
            });
            for (let i = 0, j = currentInclude.length; i < j; i++) {
                const includePath = currentInclude[i];
                // tslint:disable-next-line: forin
                for (const path in entryReferences) {
                    const subStr = includePath.slice(0, path.length);
                    if (subStr === path) {
                        let subPath;
                        if (path.length !== includePath.length) {
                            subPath = subStr;
                            pendingPath.push(includePath.slice(path.length + 1));
                        }
                        else {
                            subPath = includePath;
                        }
                        if (typeof entryReferences[path] === 'string') {
                            schemasReferred.push({
                                _content_type_uid: this.types.content_types,
                                uid: entryReferences[path],
                            });
                        }
                        else if (entryReferences[path].length) {
                            entryReferences[path].forEach((contentTypeUid) => {
                                schemasReferred.push({
                                    _content_type_uid: this.types.content_types,
                                    uid: contentTypeUid,
                                });
                            });
                        }
                        paths.push(subPath);
                        break;
                    }
                }
            }
            schemaList.$or = schemasReferred;
            return {
                // path, that's possible in the current schema
                paths,
                // paths, that's yet to be traversed
                pendingPath,
                // schemas, to be loaded!
                schemaList,
            };
        });
    }
    // tslint:disable-next-line: max-line-length
    fetchPathDetails(data, locale, pathArr, queryBucket, shelf, assetsOnly = false, parent, pos, counter = 0) {
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
                            });
                            shelf.push({
                                path: data,
                                position: idx,
                                uid: elem,
                            });
                        }
                        else if (elem && typeof elem === 'object' && elem.hasOwnProperty('_content_type_uid')) {
                            queryBucket.$or.push({
                                _content_type_uid: elem._content_type_uid,
                                locale,
                                uid: elem.uid,
                            });
                            shelf.push({
                                path: data,
                                position: idx,
                                uid: elem.uid,
                            });
                        }
                    });
                }
                else if (typeof data === 'object') {
                    if (data.hasOwnProperty('_content_type_uid')) {
                        queryBucket.$or.push({
                            _content_type_uid: data._content_type_uid,
                            locale,
                            uid: data.uid,
                        });
                        shelf.push({
                            path: parent,
                            position: pos,
                            uid: data.uid,
                        });
                    }
                }
            }
            else if (typeof data === 'string') {
                queryBucket.$or.push({
                    _content_type_uid: this.types.assets,
                    _version: { $exists: true },
                    locale,
                    uid: data,
                });
                shelf.push({
                    path: parent,
                    position: pos,
                    uid: data,
                });
            }
        }
        else {
            const currentField = pathArr[counter];
            counter++;
            if (data instanceof Array) {
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < data.length; i++) {
                    if (data[i][currentField]) {
                        this.fetchPathDetails(data[i][currentField], locale, pathArr, queryBucket, shelf, assetsOnly, data[i], currentField, counter);
                    }
                }
            }
            else {
                if (data[currentField]) {
                    this.fetchPathDetails(data[currentField], locale, pathArr, queryBucket, shelf, assetsOnly, data, currentField, counter);
                }
            }
        }
        // since we've reached last of the paths, return!
        return;
    }
    // tslint:disable-next-line: max-line-length
    fetchDocuments(query, locale, contentTypeUid, paths, include, queries, result, bookRack, includeAll = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let contents;
            if (contentTypeUid === this.types.assets) {
                contents = yield fs_1.readFile(utils_1.getAssetsPath(locale) + '.json');
            }
            else {
                contents = yield fs_1.readFile(utils_1.getEntriesPath(locale, contentTypeUid) + '.json');
            }
            result.docs = result.docs.concat(contents.filter(sift_1.default(query)));
            result.docs.forEach((doc) => {
                this.projections.forEach((key) => {
                    if (doc.hasOwnProperty(key)) {
                        delete doc[key];
                    }
                });
            });
            if (result.length === 0) {
                return;
            }
            if (include.length || includeAll) {
                paths.forEach((path) => {
                    this.fetchPathDetails(result.docs, locale, path.split('.'), queries, bookRack, false, result, 0);
                });
            }
            else {
                // if there are no includes, only fetch assets
                paths.forEach((path) => {
                    this.fetchPathDetails(result.docs, locale, path.split('.'), queries, bookRack, true, result, 0);
                });
            }
            return;
        });
    }
    includeAssetsOnly(entries, locale, contentTypeUid) {
        return __awaiter(this, void 0, void 0, function* () {
            const schemas = yield fs_1.readFile(utils_1.getContentTypesPath(locale) + '.json');
            let schema;
            for (let i = 0, j = schemas.length; i < j; i++) {
                if (schemas[i].uid === contentTypeUid) {
                    schema = schemas[i];
                    break;
                }
            }
            // should not enter this section
            // if the schema doesn't exist, error should have occurred before
            if (typeof schema === 'undefined' || typeof schema[this.types.assets] !== 'object') {
                return;
            }
            const paths = Object.keys(schema[this.types.assets]);
            const shelf = [];
            const queryBucket = {
                $or: [],
            };
            for (let i = 0, j = paths.length; i < j; i++) {
                this.fetchPathDetails(entries, locale, paths[i].split('.'), queryBucket, shelf, true, entries, 0);
            }
            if (shelf.length === 0) {
                return;
            }
            const assets = yield fs_1.readFile(utils_1.getAssetsPath(locale) + '.json');
            const filteredAssets = assets.filter(sift_1.default(queryBucket));
            for (let l = 0, m = shelf.length; l < m; l++) {
                for (let n = 0, o = filteredAssets.length; n < o; n++) {
                    if (shelf[l].uid === filteredAssets[n].uid) {
                        shelf[l].path[shelf[l].position] = filteredAssets[n];
                        break;
                    }
                }
            }
            return;
        });
    }
    bindReferences(entries, contentTypeUid, locale) {
        return __awaiter(this, void 0, void 0, function* () {
            const ctQuery = {
                $or: [{
                        _content_type_uid: this.types.content_types,
                        uid: contentTypeUid,
                    }],
            };
            const { paths, // ref. fields in the current content types
            ctQueries, } = yield this.getAllReferencePaths(ctQuery, locale);
            const queries = {
                $or: [],
            }; // reference field paths
            const objectPointerList = []; // a mapper object, that holds pointer to the original element
            // iterate over each path in the entries and fetch the references
            // while fetching, keep track of their location
            for (let i = 0, j = paths.length; i < j; i++) {
                this.fetchPathDetails(entries, locale, paths[i].split('.'), queries, objectPointerList, true, entries, 0);
            }
            // even after traversing, if no references were found, simply return the entries found thusfar
            if (objectPointerList.length === 0) {
                return entries;
            }
            // else, self-recursively iterate and fetch references
            // Note: Shelf is the one holding `pointers` to the actual entry
            // Once the pointer has been used, for GC, point the object to null
            return this.includeAllReferencesIteration(queries, ctQueries, locale, objectPointerList);
        });
    }
    bindLeftoverAssets(queries, locale, pointerList) {
        return __awaiter(this, void 0, void 0, function* () {
            const contents = yield fs_1.readFile(utils_1.getAssetsPath(locale) + '.json');
            const filteredAssets = contents.filter(sift_1.default(queries));
            filteredAssets.forEach((doc) => {
                this.projections.forEach((key) => {
                    if (doc.hasOwnProperty(key)) {
                        delete doc[key];
                    }
                });
            });
            for (let l = 0, m = pointerList.length; l < m; l++) {
                for (let n = 0, o = filteredAssets.length; n < o; n++) {
                    if (pointerList[l].uid === filteredAssets[n].uid) {
                        pointerList[l].path[pointerList[l].position] = filteredAssets[n];
                        break;
                    }
                }
            }
            return;
        });
    }
    // tslint:disable-next-line: max-line-length
    includeAllReferencesIteration(oldEntryQueries, oldCtQueries, locale, oldObjectPointerList, depth = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (depth > this.q.referenceDepth || oldObjectPointerList.length === 0) {
                return;
            }
            else if (oldCtQueries.$or.length === 0 && oldObjectPointerList.length > 0 && oldEntryQueries.$or.length > 0) {
                // its most likely only assets
                yield this.bindLeftoverAssets(oldEntryQueries, locale, oldObjectPointerList);
                return;
            }
            const { ctQueries, paths, } = yield this.getAllReferencePaths(oldCtQueries, locale);
            // GC to aviod mem leaks
            oldCtQueries = null;
            const queries = {
                $or: [],
            };
            let result = {
                docs: [],
            };
            const shelf = [];
            yield this.subIncludeAllReferencesIteration(oldEntryQueries, locale, paths, queries, result, shelf);
            // GC to avoid mem leaks!
            oldEntryQueries = null;
            for (let i = 0, j = oldObjectPointerList.length; i < j; i++) {
                const element = oldObjectPointerList[i];
                let flag = true;
                for (let k = 0, l = result.docs.length; k < l; k++) {
                    if (result.docs[k].uid === element.uid) {
                        element.path[element.position] = result.docs[k];
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    for (let e = 0, f = oldObjectPointerList[i].path.length; e < f; e++) {
                        // tslint:disable-next-line: max-line-length
                        if (oldObjectPointerList[i].path[e].hasOwnProperty('_content_type_uid') && Object.keys(oldObjectPointerList[i].path[e]).length === 2) {
                            oldObjectPointerList[i].path.splice(e, 1);
                            break;
                        }
                    }
                }
            }
            // GC to avoid mem leaks!
            oldObjectPointerList = null;
            result = null;
            ++depth;
            // Iterative loops, that traverses paths and binds them onto entries
            yield this.includeAllReferencesIteration(queries, ctQueries, locale, shelf, depth);
            return;
        });
    }
    subIncludeAllReferencesIteration(eQuieries, locale, paths, queries, result, shelf) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contentTypes, aggQueries, } = utils_1.segregateQueries(eQuieries.$or);
            const promises = [];
            contentTypes.forEach((contentType) => {
                promises.push(this.fetchDocuments(aggQueries[contentType], locale, contentType, paths, [], queries, result, shelf, true));
            });
            // wait for all promises to be resolved
            yield Promise.all(promises);
            return {
                queries,
                result,
                shelf,
            };
        });
    }
    getAllReferencePaths(contentTypeQueries, locale) {
        return __awaiter(this, void 0, void 0, function* () {
            const contents = yield fs_1.readFile(utils_1.getContentTypesPath(locale) + '.json');
            const filteredContents = contents.filter(sift_1.default(contentTypeQueries));
            const ctQueries = {
                $or: [],
            };
            let paths = [];
            for (let i = 0, j = filteredContents.length; i < j; i++) {
                let assetFieldPaths;
                let entryReferencePaths;
                if (filteredContents[i].hasOwnProperty(this.types.assets)) {
                    assetFieldPaths = Object.keys(filteredContents[i][this.types.assets]);
                    paths = paths.concat(assetFieldPaths);
                }
                if (filteredContents[i].hasOwnProperty('_references')) {
                    entryReferencePaths = Object.keys(filteredContents[i][this.types.references]);
                    paths = paths.concat(entryReferencePaths);
                    for (let k = 0, l = entryReferencePaths.length; k < l; k++) {
                        if (typeof filteredContents[i][this.types.references][entryReferencePaths[k]] === 'string') {
                            ctQueries.$or.push({
                                _content_type_uid: this.types.content_types,
                                uid: filteredContents[i][this.types.references][entryReferencePaths[k]],
                            });
                        }
                        else if (filteredContents[i][this.types.references][entryReferencePaths[k]].length) {
                            filteredContents[i][this.types.references][entryReferencePaths[k]].forEach((uid) => {
                                ctQueries.$or.push({
                                    _content_type_uid: this.types.content_types,
                                    uid,
                                });
                            });
                        }
                    }
                }
            }
            return {
                ctQueries,
                paths,
            };
        });
    }
}
exports.Stack = Stack;
