/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
/**
 * @summary
 *  Expose SDK query methods on Stack
 * @returns {this} - Returns `stack's` instance
 */
export declare class Stack {
    config: any;
    readonly contentStore: any;
    readonly types: any;
    readonly projections: string[];
    readonly q: any;
    readonly lessThan: (key: string, value: any) => Stack;
    readonly lessThanOrEqualTo: (key: string, value: any) => Stack;
    readonly greaterThan: (key: string, value: any) => Stack;
    readonly greaterThanOrEqualTo: (key: string, value: any) => Stack;
    readonly notEqualTo: (key: string, value: any) => Stack;
    readonly containedIn: (key: string, value: any) => Stack;
    readonly notContainedIn: (key: string, value: any) => Stack;
    readonly exists: (key: string) => Stack;
    readonly notExists: (key: string) => Stack;
    readonly ascending: (key: string) => Stack;
    readonly descending: (key: string) => Stack;
    readonly skip: (value: any) => Stack;
    readonly limit: (value: any) => Stack;
    readonly or: (query: any) => Stack;
    readonly nor: (query: any) => Stack;
    readonly not: (query: any) => Stack;
    readonly and: (query: any) => Stack;
    constructor(config: any);
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
    connect(overrides?: any): Promise<any>;
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
    contentType(uid: any): Stack;
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
    entries(): this;
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
    entry(uid?: any): this;
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
    asset(uid?: any): Stack;
    /**
     * @public
     * @method assets
     * @summary Get assets details
     * @example
     * Stack.assets().find()
     *
     * @returns {this} - Returns `stack's` instance
     */
    assets(): Stack;
    /**
     * @public
     * @method schemas
     * @summary Get content type schemas
     * @example
     * Stack.schemas().find()
     *
     * @returns {this} - Returns `stack's` instance
     */
    schemas(): Stack;
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
    schema(uid?: string): Stack;
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
    equalTo(key: any, value: any): this;
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
    where(expr: any): this;
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
    count(): Promise<unknown>;
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
    query(userQuery: any): this;
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
    tags(values: any): this;
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
    includeCount(): this;
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
    language(languageCode: any): this;
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
    include(fields: any): this;
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
    includeReferences(depth?: number): this;
    /**
     * @public
     * @method excludeReferences
     * @summary
     *  Excludes all references of the entries being scanned
     *
     * @example
     * Stack.contentType('example').entries().excludeReferences().find()
     * .then((result) => {
     *    // ‘result’ entries without references
     *  }).catch((error) => {
     *    // error trace
     *  })
     *
     * @returns {this} - Returns `stack's` instance
     */
    excludeReferences(): this;
    /**
     * @public
     * @method includeContentType
     * @description Includes the total number of entries returned in the response.
     * @example
     * const query = Stack.contentType('example').entries().includeContentType().find()
     * query.then((result) => {
     *   // ‘result’ contains a list of entries along contentType
     * }).catch((error) => {
     *   // error trace
     * })
     *
     * @returns {this} - Returns `stack's` instance
     */
    includeContentType(): this;
    /**
     * @public
     * @method getQuery
     * @description Returns the raw (JSON) query based on the filters applied on Query object.
     * @example
     * Stack.contentType('content_type_uid')
     *  .eqaulTo('title','Demo')
     *  .getQuery()
     *  .find()
     *
     * @returns {this} - Returns `stack's` instance
     */
    getQuery(): any;
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
    regex(key: any, value: any, options?: string): this;
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
    only(fields: any): this;
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
    except(fields: any): this;
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
    queryReferences(query: any): this;
    /**
     * @public
     * @method referenceDepth
     * @summary
     * Use it along with .includeReferences()
     * Overrides the default reference depths defined for references - 2
     * i.e. If A -> B -> C -> D -> E, so calling .includeReferences() on content type A,
     * would result in all references being resolved until its nested child reference E
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
    referenceDepth(depth: any): this;
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
    find(): Promise<unknown>;
    /**
     * @public
     * @method findOne
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
    findOne(): Promise<unknown>;
    /**
     * @private
     * @method preProcess
     * @description
     * Runs before .find()
     * Formats the queries/sets defaults and returns the locale, key & filepath of the data
     * @returns {object} - Returns the query's key, locale & filepath of the data
     */
    private preProcess;
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
    private postProcess;
    private includeSpecificReferences;
    private includeReferenceIteration;
    private subIncludeReferenceIteration;
    private getReferencePath;
    private fetchPathDetails;
    private fetchDocuments;
    private includeAssetsOnly;
    private bindReferences;
    private includeAllReferencesIteration;
    private subIncludeAllReferencesIteration;
    private getAllReferencePaths;
}
