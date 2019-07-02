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
            if (key && value && typeof key === 'string' && typeof value !== 'undefined') {
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
            if (key && value && typeof key === 'string' && Array.isArray(value)) {
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
        return function () {
            this.q.logical = this.q.logical || {};
            this.q.logical[type] = this.q.logical[type] || {};
            this.q.logical[type] = this.q.query;
            delete this.q.query;
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
        this.q = this.q || {};
        this.q.query = this.q.query || {};
        /**
         * @method lessThan
         * @description Retrieves entries in which the value of a field is lesser than the provided value
         * @param {String} key - uid of the field
         * @param {*} value - Value used to match or compare
         * @example
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.lessThan('created_at','2015-06-22').find()
         * data.then(function(result) {
         *      // result content the data who's 'created_at date'
         *      //is less than '2015-06-22'
         * }).catch((error) => {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.lessThan = extend.compare('$lt');
        /**
         * @method lessThanOrEqualTo
         * @description Retrieves entries in which the value of a field is lesser than or equal to the provided value.
         * @param {String} key - uid of the field
         * @param {*} value - Value used to match or compare
         * @example
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.lessThanOrEqualTo('created_at','2015-06-22').find()
         * data.then(function(result) {
         *      // result contain the data of entries where the
         *      //'created_at' date will be less than or equalto '2015-06-22'.
         * }).catch((error) => {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.lessThanOrEqualTo = extend.compare('$lte');
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
         * }).catch((error) => {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.greaterThan = extend.compare('$gt');
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
         * }).catch((error) => {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.greaterThanOrEqualTo = extend.compare('$gte');
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
         * }).catch((error) => {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.notEqualTo = extend.compare('$ne');
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
         * }).catch((error) => {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.containedIn = extend.contained(true);
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
         * }).catch((error) => {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.notContainedIn = extend.contained(false);
        /**
         * @method exists
         * @description Retrieve entries if value of the field, mentioned in the condition, exists.
         * @param {String} key - uid of the field
         * @example
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.exists('featured').find()
         * data.then(function(result) {
         *      // ‘result’ contains the list of entries in which "featured" exists.
         * }).catch((error) => {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.exists = extend.exists(true);
        /**
         * @method notExists
         * @description Retrieve entries if value of the field, mentioned in the condition, does not exists.
         * @param {String} key - uid of the field
         * @example
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.notExists('featured').find()
         * data.then(function(result) {
         *      // result is the list of non-existing’featured’" data.
         * }).catch((error) => {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.notExists = extend.exists(false);
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
         * }).catch((error) => {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.ascending = extend.sort('asc');
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
         * }).catch((error) => {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.descending = extend.sort('desc');
        /**
         * @method skip
         * @description Skips at specific number of entries.
         * @param {Number} skip - number of entries to be skipped
         * @example
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.skip(5).find()
         * data.then(function(result) {
         *      //result
         * }).catch((error) => {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.skip = extend.pagination('skip');
        /**
         * @method limit
         * @description Returns a specific number of entries based on the set limit
         * @param {Number} limit - maximum number of entries to be returned
         * @example
         * let blogQuery = Stack().contentType('example').entries();
         * let data = blogQuery.limit(10).find()
         * data.then(function(result) {
         *      // result contains the limited number of entries
         * }).catch((error) => {
         *      // error function
         * })
         * @returns {this} - Returns `stack's` instance
         */
        this.limit = extend.pagination('limit');
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
        this.or = extend.logical('$or');
        this.nor = extend.logical('$nor');
        this.not = extend.logical('$not');
        /**
         * @method and
         * @description Retrieve entries that satisfy all the provided conditions.
         * @param {object} queries - array of query objects or raw queries.
         * @examplemerge(defaultConfig, ...stackArguments)
         * let Query1 = Stack.contentType('example').entries().equalTo('title', 'Demo')
         * let Query2 = Stack.contentType('example').entries().lessThan('comments', 10)
         * blogQuery.and(Query1, Query2).find()
         * @returns {this} - Returns `stack's` instance
         */
        this.and = extend.logical('$and');
    }
    /**
     * TODO
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
        return new Promise((resolve, reject) => {
            try {
                return resolve(this.config);
            }
            catch (error) {
                reject(error);
            }
        });
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
     * @method entries
     * @summary
     *  To get entries from contentType
     * @example
     * Stack.contentType('example').entries().find()
     * @returns {this} - Returns `stack's` instance
     */
    entries() {
        if (typeof this.q.content_type_uid === 'undefined') {
            throw new Error('Please call .contentType() before calling .entries()!');
        }
        return this;
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
    entry(uid) {
        this.q.isSingle = true;
        if (typeof this.q.content_type_uid === 'undefined') {
            throw new Error('Please call .contentType() before calling .entries()!');
        }
        if (uid && typeof uid === 'string') {
            this.q.query[uid] = uid;
        }
        return this;
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
    asset(uid) {
        const stack = new Stack(this.config);
        stack.q.isSingle = true;
        if (uid && typeof uid === 'string') {
            stack.q.query[uid] = uid;
        }
        return stack;
    }
    /**
     * @method assets
     * @summary
     * To get assets
     * @example
     * Stack.assets().find()
     * @returns {this} - Returns `stack's` instance
     */
    assets() {
        const stack = new Stack(this.config);
        stack.q.content_type_uid = '_assets';
        return stack;
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
     * }).catch((error) => {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    equalTo(key, value) {
        if (key && typeof key === 'string') {
            // this.q.query[key] = value
            // doing this, since if there are 2 conditions to be matched against a key!
            if (this.q.query.hasOwnProperty(key)) {
                if (this.q.query.hasOwnProperty('$or')) {
                    this.q.query.$or.push({
                        [key]: value,
                    });
                }
                else {
                    this.q.query.$or = [{
                            [key]: value,
                        }];
                }
            }
            else {
                this.q.query[key] = value;
            }
            return this;
        }
        throw new Error('Kindly provide valid parameters for .equalTo()!');
    }
    /**
     * @method where
     * @summary
     * Pass JS expression or a full function to the query system
     * @description
     * Evaluate js expressions
     * @param field
     * @param value
     * @returns {this} - Returns `stack's` instance
     * @example
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.where("this.title === 'Amazon_Echo_Black'").find()
     * data.then(function(result) {
     *   // ‘result’ contains the list of entries where value of
     *   //‘title’ is equal to ‘Demo’.
     * }).catch(error) => {
     *   // error function
     * })
     */
    where(expr) {
        if (expr) {
            this.q.query.$where = expr;
            return this;
        }
        throw new Error('Kindly provide a valid field and expr/fn value for \'.where()\'');
    }
    /**
     * @method count
     * @description Returns the total number of entries
     * @example
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.count().find()
     * data.then(function(result) {
     *  // returns 'example' content type's entries
     * }).catch(error) => {
     *   // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    count() {
        this.q.queryType = 'count';
        return this;
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
    query(userQuery) {
        if (typeof userQuery === 'object') {
            this.q.query = lodash_1.merge(this.q.query, userQuery);
            return this;
        }
        throw new Error('Kindly provide valid parameters for .query()!');
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
     * }).catch((error) => {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    tags(values) {
        if (values && typeof values === 'object' && values instanceof Array) {
            this.q.query.$tags = values;
            return this;
        }
        throw new Error('Kindly provide valid parameters for .tags()!');
    }
    /**
     * @method includeCount
     * @description Includes the total number of entries returned in the response.
     * @example
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.includeCount().find()
     * data.then(function(result) {
     *      // ‘result’ contains a list of entries in which count of object is present at array[1] position.
     * }).catch((error) => {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    includeCount() {
        this.q.include_count = true;
        return this;
    }
    /**
     * @method language
     * @description to retrive the result bsed on the specific locale.
     * @example
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.language('fr-fr').find()
     * data.then(function(result) {
     *      // ‘result’ contains a list of entries of locale fr-fr
     * }).catch((error) => {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    language(languageCode) {
        if (languageCode && typeof languageCode === 'string') {
            this.q.locale = languageCode;
            return this;
        }
        throw new Error(`${languageCode} should be of type string and non-empty!`);
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
     * }).catch((error) => {
     *        // error function
     * })
     */
    include(fields) {
        if (fields && typeof fields === 'object' && fields instanceof Array && fields.length) {
            this.q.include = fields;
        }
        else if (fields && typeof fields === 'string') {
            this.q.include = [fields];
        }
        else {
            throw new Error('Kindly pass \'string\' OR \'array\' fields for .include()!');
        }
        return this;
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
     * }).catch((error) => {
     *        // error function
     * })
     */
    includeReferences() {
        this.q.includeAllReferences = true;
        return this;
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
     *  }).catch((error) => {
     *    // error function
     *  })
     */
    excludeReferences() {
        this.q.excludeAllReferences = true;
        return this;
    }
    /**
     * @method includeContentType
     * @description Includes the total number of entries returned in the response.
     * @example
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.includeContentType().find()
     * data.then(function(result) {
     *      // ‘result’ contains a list of entries along contentType
     * }).catch((error) => {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    includeContentType() {
        this.q.include_content_type = true;
        return this;
    }
    /**
     * @method getQuery
     * @description Returns the raw (JSON) query based on the filters applied on Query object.
     * @example
     * Stack.contentType('content_type_uid').eqaulTo('title','Demo').getQuery().find()
     * @returns {this} - Returns `stack's` instance
     */
    getQuery() {
        return this.q.query;
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
    regex(key, value, options = 'g') {
        if (key && value && typeof key === 'string' && typeof value === 'string') {
            if (this.q.query.hasOwnProperty(key)) {
                if (this.q.query.hasOwnProperty('$or')) {
                    this.q.query.$or.push({
                        [key]: {
                            $options: options,
                            $regex: value,
                        },
                    });
                }
                else {
                    this.q.query.$or = [{
                            $options: options,
                            $regex: value,
                        }];
                }
            }
            else {
                this.q.query[key] = {
                    $options: options,
                    $regex: value,
                };
            }
            return this;
        }
        throw new Error('Kindly provide valid parameters.');
    }
    /**
     * @method only
     * @example
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.only(['title','uid']).find()
     * data.then(function(result) {
     *      // ‘result’ contains a list of entries with field title and uid only
     * }).catch((error) => {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    only(fields) {
        if (fields && typeof fields === 'object' && fields instanceof Array && fields.length) {
            this.q.only = {};
            // tslint:disable-next-line: forin
            for (const field in fields) {
                this.q.only[field] = 1;
            }
            return this;
        }
        throw new Error('Kindly provide valid parameters for .only()!');
    }
    /**
     * @method except
     * @example
     * let blogQuery = Stack().contentType('example').entries();
     * let data = blogQuery.except(['title','uid']).find()
     * data.then(function(result) {
     *      // ‘result’ contains a list of entries without fields title and uid only
     * }).catch((error) => {
     *      // error function
     * })
     * @returns {this} - Returns `stack's` instance
     */
    except(fields) {
        if (fields && typeof fields === 'object' && fields instanceof Array && fields.length) {
            this.q.only = {};
            // tslint:disable-next-line: forin
            for (const field in fields) {
                this.q.except[field] = -1;
            }
            return this;
        }
        throw new Error('Kindly provide valid parameters for .except()!');
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
    queryReferences(query) {
        if (query && typeof query === 'object') {
            this.q.queryReferences = query;
            return this;
        }
        throw new Error('Kindly valid parameters for \'.queryReferences()\'!');
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
    find() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { filePath, key, locale, } = this.preProcess();
                let data = yield fs_1.readFile(filePath);
                data = data.filter(sift_1.default(this.q.query));
                if (this.q.includeSpecificReferences) {
                    yield this
                        .includeSpecificReferences(data, this.q.content_type_uid, this.q.locale, this.q
                        .includeSpecificReferences);
                }
                else if (this.q.queryOnReferences) {
                    yield this.includeAllReferences(data, locale, {});
                    data = data.filter(sift_1.default(this.q.queryOnReferences));
                }
                else if (this.q.includeAllReferences) {
                    yield this.includeAllReferences(data, locale, {});
                }
                else {
                    yield this.includeAssetsOnly(data, locale, this.q.content_type_uid);
                }
                const { output } = yield this.postProcess(data, key, locale);
                return resolve(output);
            }
            catch (error) {
                return reject(error);
            }
        }));
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
    findOne() {
        this.q.single = true;
        return new Promise((resolve, reject) => {
            this.find().then((result) => {
                return resolve(result);
            }).catch((error) => {
                return reject(error);
            });
        });
    }
    includeSpecificReferences(entries, contentTypeUid, locale, include) {
        return __awaiter(this, void 0, void 0, function* () {
            const ctQuery = {
                _content_type_uid: '_content_types',
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
                this.fetchPathDetails(entries, locale, paths[i].split('.'), queries, shelf, true, entries, 0);
            }
            // even after traversing, if no references were found, simply return the entries found thusfar
            if (shelf.length === 0) {
                return entries;
            }
            // else, self-recursively iterate and fetch references
            // Note: Shelf is the one holding `pointers` to the actual entry
            // Once the pointer has been used, for GC, point the object to null
            return this.includeReferenceIteration(queries, schemaList, locale, pendingPath, shelf);
        });
    }
    includeReferenceIteration(eQuery, ctQuery, locale, include, oldShelf) {
        return __awaiter(this, void 0, void 0, function* () {
            if (oldShelf.length === 0 || ctQuery.$or.length === 0) {
                return;
            }
            const { paths, pendingPath, schemaList, } = yield this.getReferencePath(ctQuery, locale, include);
            const queries = {
                $or: [],
            };
            let result = [];
            const shelf = [];
            yield this.subIncludeReferenceIteration(eQuery, locale, paths, include, queries, result, shelf);
            // GC to avoid mem leaks!
            eQuery = null;
            for (let i = 0, j = oldShelf.length; i < j; i++) {
                const element = oldShelf[i];
                for (let k = 0, l = result.length; k < l; k++) {
                    if (result[k].uid === element.uid) {
                        element.path[element.position] = result[k];
                        break;
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
            /**
             * Segregate eQueries based on their content types
             * {
             *    content_type_uid: [],
             *    ...
             * }
             */
            const { contentTypes, aggQueries, } = utils_1.segregateQueries(eQuieries.$or);
            const promises = [];
            contentTypes.forEach((contentType) => {
                promises.push(this.fetchEntries(aggQueries[contentType], locale, contentType, paths, include, queries, result, shelf));
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
                entryReferences = lodash_1.merge(entryReferences, schema._references);
                // tslint:disable-next-line: forin
                for (const path in schema._assets) {
                    paths.push(path);
                }
            });
            for (let i = 0, j = currentInclude.length; i < j; i++) {
                const includePath = currentInclude[i];
                // tslint:disable-next-line: forin
                for (const path in entryReferences) {
                    const idx = includePath.indexOf(path);
                    if (~idx) {
                        let subPath;
                        // Its the complete path!! Hurrah!
                        if (path.length !== includePath.length) {
                            subPath = includePath.slice(0, path.length);
                            pendingPath.push(includePath.slice(path.length + 1));
                        }
                        else {
                            subPath = includePath;
                        }
                        if (typeof entryReferences[path] === 'string') {
                            schemasReferred.push({
                                _content_type_uid: '_content_types',
                                uid: entryReferences[path],
                            });
                        }
                        else {
                            entryReferences[path].forEach((contentTypeUid) => {
                                schemasReferred.push({
                                    _content_type_uid: '_content_types',
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
    fetchPathDetails(data, locale, pathArr, queryBucket, shelf, assetsOnly = false, parent, pos, counter = 0) {
        if (counter === (pathArr.length)) {
            if (data && typeof data === 'object') {
                if (data instanceof Array && data.length) {
                    data.forEach((elem, idx) => {
                        if (typeof elem === 'string') {
                            queryBucket.$or.push({
                                _content_type_uid: '_assets',
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
                    _content_type_uid: '_assets',
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
    fetchEntries(query, locale, contentTypeUid, paths, include, queries, result, bookRack) {
        return __awaiter(this, void 0, void 0, function* () {
            const contents = yield fs_1.readFile(utils_1.getEntriesPath(locale, contentTypeUid) + '.json');
            result = result.concat(contents.filter(sift_1.default(query)));
            if (result.length === 0) {
                return;
            }
            if (include.length) {
                paths.forEach((path) => {
                    // console.log('path:', path)
                    this.fetchPathDetails(result, locale, path.split('.'), queries, bookRack, false, result, 0);
                });
            }
            else {
                // if there are no includes, only fetch assets
                paths.forEach((path) => {
                    this.fetchPathDetails(result, locale, path.split('.'), queries, bookRack, true, result, 0);
                });
            }
            return;
        });
    }
    includeAssetsOnly(entries, contentTypeUid, locale) {
        return __awaiter(this, void 0, void 0, function* () {
            const schemas = yield fs_1.readFile(utils_1.getContentTypesPath(locale) + '.json');
            let schema;
            for (let i = 0, j = schema.length; i < j; i++) {
                if (schemas[i].uid === contentTypeUid) {
                    schema = schemas[i];
                    break;
                }
            }
            // should not enter this section
            // if the schema doesn't exist, error should have occurred before
            if (typeof schema === 'undefined') {
                return;
            }
            const assetPaths = schema._assets;
            const paths = Object.keys(assetPaths);
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
            // might not be required
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
    findReferences(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = utils_1.getEntriesPath(query.locale, query.content_type_uid) + '.json';
            const data = yield fs_1.readFile(path);
            return data.filter(sift_1.default(query.query));
        });
    }
    includeAllReferences(entry, locale, references, parentUid) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (entry === null || typeof entry !== 'object') {
                return resolve();
            }
            // current entry becomes the parent
            if (entry.uid) {
                parentUid = entry.uid;
            }
            const referencesFound = [];
            // iterate over each key in the object
            for (const prop in entry) {
                if (entry[prop] !== null && typeof entry[prop] === 'object') {
                    if (entry[prop] && entry[prop].reference_to) {
                        if ((!(this.q.includeReferences) && entry[prop].reference_to === '_assets')
                            || this.q.includeReferences) {
                            if (entry[prop].values.length === 0) {
                                entry[prop] = [];
                            }
                            else {
                                let uids = entry[prop].values;
                                if (typeof uids === 'string') {
                                    uids = [uids];
                                }
                                if (entry[prop].reference_to !== '_assets') {
                                    uids = lodash_1.filter(uids, (uid) => {
                                        return !(utils_1.checkCyclic(uid, references));
                                    });
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
                                    };
                                    referencesFound.push(new Promise((rs, rj) => {
                                        return self.findReferences(query).then((entities) => {
                                            entities = lodash_1.cloneDeep(entities);
                                            if (entities.length === 0) {
                                                entry[prop] = [];
                                                return rs();
                                            }
                                            else if (parentUid) {
                                                references[parentUid] = references[parentUid] || [];
                                                references[parentUid] = lodash_1.uniq(references[parentUid]
                                                    .concat(lodash_1.map(entities, 'uid')));
                                            }
                                            if (typeof entry[prop].values === 'string') {
                                                entry[prop] = ((entities === null) ||
                                                    entities.length === 0) ? null
                                                    : entities[0];
                                            }
                                            else {
                                                // format the references in order
                                                const referenceBucket = [];
                                                query.query.uid.$in.forEach((entityUid) => {
                                                    const elem = lodash_1.find(entities, (entity) => {
                                                        return entity.uid === entityUid;
                                                    });
                                                    if (elem) {
                                                        referenceBucket.push(elem);
                                                    }
                                                });
                                                entry[prop] = referenceBucket;
                                            }
                                            return self.includeAllReferences(entry[prop], locale, references, parentUid)
                                                .then(rs)
                                                .catch(rj);
                                        });
                                    }));
                                }
                            }
                        }
                    }
                    else {
                        referencesFound.push(self.includeAllReferences(entry[prop], locale, references, parentUid));
                    }
                }
            }
            return Promise.all(referencesFound)
                .then(resolve)
                .catch(reject);
        });
    }
    preProcess() {
        const locale = (typeof this.q.locale === 'string') ? this.q.locale : 'en-us';
        let key;
        let filePath;
        switch (this.q.content_type_uid) {
            case '_assets':
                filePath = utils_1.getAssetsPath(locale) + '.json';
                key = (this.q.isSingle) ? 'asset' : 'assets';
                break;
            case '_content_types':
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
        return {
            filePath,
            key,
            locale,
        };
    }
    postProcess(data, key, locale) {
        return __awaiter(this, void 0, void 0, function* () {
            const output = {
                content_type_uid: this.q.content_type_uid,
                locale,
            };
            if (this.q.count) {
                output.count = data.length;
            }
            // data filtering
            if (this.q.query) {
                data = data.filter(sift_1.default(this.q.query));
            }
            if (this.q.include_content_type) {
                const path = utils_1.getContentTypesPath(this.q.locale) + '.json';
                // ideally, if the content type doesn't exist, an error will be thrown before it reaches this line
                const contentTypes = yield fs_1.readFile(path);
                for (let i = 0, j = contentTypes.length; i < j; i++) {
                    if (contentTypes[i].uid === this.q.content_type_uid) {
                        output.content_type = contentTypes[i];
                        break;
                    }
                }
            }
            if (this.q.isSingle) {
                output[key] = (data.length) ? data[0] : null;
                return output;
            }
            // TODO: sorting logic
            if (this.q.skip) {
                data.splice(0, this.q.skip);
            }
            if (this.q.limit) {
                data = data.splice(0, this.q.limit);
            }
            if (this.q.only) {
                const only = this.q.only.toString().replace(/\./g, '/');
                data = json_mask_1.default(data, only);
            }
            else if (this.q.except) {
                const bukcet = this.q.except.toString().replace(/\./g, '/');
                const except = json_mask_1.default(data, bukcet);
                data = utils_1.difference(data, except);
            }
            return output;
        });
    }
}
exports.Stack = Stack;
