/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */
/**
 * @summary
 *  Expose SDK query methods on Stack
 * @returns {this} - Returns `stack's` instance
 */
export declare class Stack {
    baseDir: any;
    masterLocale: any;
    config: any;
    contentTypeUid: string;
    type: string;
    q: any;
    assetUid: any;
    entryUid: any;
    lessThan: (key: any, value: any) => any;
    lessThanOrEqualTo: (key: any, value: any) => any;
    greaterThan: (key: any, value: any) => any;
    greaterThanOrEqualTo: (key: any, value: any) => any;
    notEqualTo: (key: any, value: any) => any;
    containedIn: (key: any, value: any) => any;
    notContainedIn: (key: any, value: any) => any;
    exists: (key: any) => any;
    notExists: (key: any) => any;
    ascending: (key: any) => any;
    descending: (key: any) => any;
    skip: (value: any) => any;
    limit: (value: any) => any;
    or: () => any;
    nor: () => any;
    not: () => any;
    and: () => any;
    constructor(...stackArguments: any[]);
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
    connect(overrides?: object): Promise<{}>;
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
    contentType(uid: any): Stack;
    /**
     * @method entries
     * @summary
     *  To get entries from contentType
     * @example
     * Stack.contentType('example').entries().find()
     * @returns {this} - Returns `stack's` instance
     */
    entries(): this;
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
    entry(uid?: any): this;
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
    asset(uid?: any): Stack;
    /**
     * @method assets
     * @summary
     * To get assets
     * @example
     * Stack.assets().find()
     * @returns {this} - Returns `stack's` instance
     */
    assets(): Stack;
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
    equalTo(key: any, value: any): this;
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
    where(expr: any): this;
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
    count(): this;
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
    query(userQuery: any): this;
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
    tags(values: any): this;
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
    includeCount(): this;
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
    language(languageCode: any): this;
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
    include(fields: any): this;
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
    includeReferences(): this;
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
    excludeReferences(): this;
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
    includeContentType(): this;
    /**
     * @method getQuery
     * @description Returns the raw (JSON) query based on the filters applied on Query object.
     * @example
     * Stack.contentType('contentType_uid').eqaulTo('title','Demo').getQuery().find()
     * @returns {this} - Returns `stack's` instance
     */
    getQuery(): any;
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
    regex(key: any, value: any, options?: string): this;
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
    only(fields: any): this;
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
    except(fields: any): this;
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
    queryReferences(query: any): this;
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
    find(): Promise<{}>;
    /**
   * @summary
   *  Internal method, that iteratively calls itself and binds entries reference
   * @param {Object} entry - An entry or a collection of entries, who's references are to be found
   * @param {String} locale - Locale, in which the reference is to be found
   * @param {Object} references - A map of uids tracked thusfar (used to detect cycle)
   * @param {String} parentUid - Entry uid, which is the parent of the current `entry` object
   * @returns {Object} - Returns `entry`, that has all of its reference binded
   */
    private includeSpecificReferences;
    private isPartOfInclude;
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
    findOne(): Promise<{}>;
    private queryOnReferences;
    private findReferences;
    private includeReferencesI;
    private preProcess;
    private postProcessResult;
}
