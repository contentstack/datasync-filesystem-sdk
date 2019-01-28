var Utils = require('../lib/utils')
var fs = require('fs')
var path = require('path')
var sift = require('sift').default

/**
 * @summary Creates an instance of `Entry`.
 * @description An initializer is responsible for creating Entry object.
 * @param {String} uid - uid of the entry
 * @example
 * let Entry = Contentstack.Stack().ContentType('example').Entry();
 * @returns {Entry}
 * @ignore
 */

class Entry {

    constructor() {
        this._query = {};
        /**
         * @method only
         * @description Displays values of only the specified fields of entries or assets in the response
         * @param {String} [key=BASE] -  Assets: </br>
         *                                <p>Retrieves specified field of asset</p>
         * @param {String}            -  Entries:</br>
         *                                       <p>- retrieves default fields of the schema.</p>
         *                                       <p>- referenced_content-type-uid : retrieves fields of the referred content type.</p>
         * @param {Array} values - array of fields that you want to display in the response
         * @example
         * <caption> .only with field uid </caption>
         * blogEntry.only('title')
         * @example
         * <caption> .only with field uid </caption>
         * blogEntry.only('BASE','title')
         * @example
         * <caption> .only with field uids(array) </caption>
         * blogEntry.only(['title','description'])
         * @example
         * <caption> .only with reference_field_uid and field uid </caption>
         * blogEntry.includeReference('category').only('category','title')
         * @example
         * <caption> .only with reference_field_uid and field uids(array) </caption>
         * blogEntry.includeReference('category').only('category', ['title', 'description'])
         * @returns {Entry}
         * @returns {Asset}
         */
        this.only = Utils.transform('only');
        /**
         * @method except
         * @description Displays all data of an entries or assets excluding the data of the specified fields.
         * @param {String} [key=BASE] - BASE (default value) - retrieves default fields of the schema.
                                                             - referenced_content-type-uid - retrieves fields of the referred content type.
         * @param {Array} values - array of fields that you want to skip in the response
         * @example
         * <caption> .except with field uid </caption>
         * Stack.ContentType('contentTypeUid').Query().except('title').toJSON().find()
         * @example
         * <caption> .except with field uid </caption>
         * Stack.ContentType('contentTypeUid').Query().except('BASE','title').toJSON().find()
         * @example
         * <caption> .except with field uids(array) </caption>
         * Stack.ContentType('contentTypeUid').Query().except(['title','description']).toJSON().find()
         * @example
         * <caption> .except with reference_field_uid and field uid </caption>
         * Stack.ContentType('contentTypeUid').Query().includeReference('category').except('category','title').toJSON().find()
         * @example-new
         * <caption> .except with reference_field_uid and field uids(array) </caption>
         * Stack.ContentType('contentTypeUid').Query().includeReference('category').except('category', ['title', 'description']).toJSON().find()
         * @returns {Entry} */
        this.except = Utils.transform('except');
        return this;
    }
    /**
     * @method language
     * @description Sets the language code of which you want to retrieve data.
     * @param {String} language_code - language code. e.g. 'en-us', 'ja-jp', etc.
     * @example 
     * let data = blogEntry.language('en-us')
     * data
     *      .then(function(result) {
     *           // result is  an object used to retrieve data of en-us language.
     *      }, function(error) {
     *           // error function
     *      })
     *          
     * @returns {Entry}
     */
    language(language_code) {
        if (language_code && typeof language_code === 'string') {
            this._query['locale'] = language_code;
            return this;
        } else {
            console.error("Argument should be a String.");
        }
    }

    /**
     * @method includeContentType
     * @description Include the details of the content type along with the entry/entries details.
     * @example blogEntry.includeContentType()
     * @returns {Entry}new (require('./modules/entry'))()
     */
    includeContentType() {
        this._query['include_content_type'] = true;
        return this;
    }

    /**
     * new (require('./modules/entry'))()
     * @method fetch
     * @description Fetches a particular entry/asset based on the provided entry UID/asset UID.
     * @example
     * Stack.blogEntry('entry_uid').toJSON().fetch()
     * @example
     * Stack.Assets('assets_uid').toJSON().fetch()
     */

    find() {
        let baseDir = this.baseDir
        let masterLocale = (this.masterLocale === undefined) ? "en-us" : this.masterLocale
        let result
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(baseDir)) {
                return reject(`${baseDir} didn't exist`)
            } else {
                    let dataPath = (!this._query['locale'])? path.join(baseDir, masterLocale, "data", this.content_type_uid, "index.json"): path.join(baseDir, this._query['locale'], "data", this.content_type_uid, "index.json");
                    if (this.entry_uid) {
                        fs.readFile(dataPath, 'utf8', (err, data) => {
                            if (err) {
                                return reject(err)
                            } else {
                                let entryData= JSON.parse(data)
                                let result =[]
                                
                                this.entry_uid.forEach(element => {
                                    let res = (sift({"uid":element}, entryData))
                                    console.log(res, typeof res)
                                    if(res.length>0)
                                        result.push(res[0])
                                });
                                console.log(result)
                                let res = {
                                    "entries": result
                                }
                                resolve(res)
                            }
                        })
                    } else {
                        fs.readFile(dataPath, 'utf8', (err, data) => {
                            if (err) {
                                return reject(err)
                            } else {
                                result= JSON.parse(data)
                                console.log(result)
                                let res = {
                                    "entries": result
                                }
                                resolve(res)
                            }
                        })
                    }
            }

        })
    }

}

module.exports = Entry