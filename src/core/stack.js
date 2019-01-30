var Query = require('./query')
var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var config = require('./default')
class Stack {

    constructor(...stack_arguments) {
        this.baseDir
        this.masterLocale
        this.config = _.merge({}, config, ...stack_arguments)
    }

    connect() {
        return new Promise((resolve, reject) => {
            try {
                if (!this.config['content-connector'].hasOwnProperty('base_dir')) {
                    throw new Error("Please provide base_dir to connect the filesystem.")
                } else if(!this.config.hasOwnProperty('locales') || this.config['locales'].length == 0){
                    throw new Error(`Please provide locales with code and relative_url_prefix.\n Example ==> locales:[{code:"en-us",relative_ul_prefix:"/"}].`)
                } else if (!(fs.existsSync(this.config['content-connector'].base_dir))) {
                    throw new Error(`${this.config['content-connector'].base_dir} didn't exits.`)
                } else {
                    this.baseDir = this.config['content-connector'].base_dir
                    this.masterLocale = this.config['locales'][0].code
                    return resolve(this.config['content-connector'])
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    contentType(uid) {
        if(this.baseDir == undefined){
            throw new Error("Please call the Stack.connect() first")
        }
        if (uid && typeof uid === 'string') {
            this.content_type_uid = uid;
            this.type = "contentType";
        }
        return this;
    }

    entries(...val) {
        let entry = Query
        this.entry = "multiple"
        if (this.type == undefined) {
            throw new Error("Please call contentType('uid') first")
        }
        if (val.length > 0) {
            if (arguments.length) {
                for (let i = 0; i < arguments.length; i++) {
                    entry.entry_uid = [];
                    entry.entry_uid = entry.entry_uid.concat(arguments[i]);
                }
            }
            return _.merge(this, entry)
        } else {
            return _.merge(this, entry)
        }
    }
    find() {
        let baseDir = this.baseDir
        let masterLocale = this.masterLocale
        let result
        return new Promise((resolve, reject) => {
            if (this.type == "asset") {
                let dataPath = (!this._query['locale'])? path.join(baseDir, masterLocale, "assets", "_assets.json"): path.join(baseDir, this._query['locale'], "assets", "_assets.json");
                if (!fs.existsSync(dataPath)) {
                    return reject(`${dataPath} didn't exist`)
                } else {
                    fs.readFile(dataPath, 'utf8', (err, data) => {
                        if (err) {
                            return reject(err)
                        } else {
                            let assetData = JSON.parse(data)
                            let finalRes ={}
                            if(this.asset_uid){
                                result = _.find(assetData, { 'uid': this.asset_uid })
                                finalRes.asset = result
                            }else{
                                result = assetData
                                finalRes.assets = result
                            }
                            resolve(finalRes)
                        }
                    })
                }

            } else {
                let dataPath = (!this._query['locale']) ? path.join(baseDir, masterLocale, "data", this.content_type_uid, "index.json") : path.join(baseDir, this._query['locale'], "data", this.content_type_uid, "index.json");
                if (!fs.existsSync(dataPath)) {
                    return reject(`${dataPath} didn't exist`)
                } else {
                    fs.readFile(dataPath, 'utf8', (err, data) => {
                        if (err) {
                            return reject(err)
                        } else {
                            let entryData = JSON.parse(data)
                            result = _.map(entryData, 'data')
                            let finalRes = {
                                'content_type_uid': entryData[0].content_type_uid,
                                'locale': entryData[0].locale,
                            }
                            if (this.entry == "multiple") {
                                finalRes.entries = result
                                resolve(finalRes)
                            }
                            else if (this.entry == "single") {
                                result = _.find(result, { 'uid': this.entry_uid })
                                console.log(result, this.entry_uid, "fgsfssj")
                                finalRes.entry = result
                                resolve(finalRes)
                            }

                        }
                    })
                }
            }
        })


    }

    /**
     * @method Entry
     * @description Retrieves the entry based on the specified UID 
     * @param {String} uid - uid of entry you want to retrieve
     * @example 
     * let data = Stack.ContentType('blog').Entry('bltsomething123').toJSON().fetch()
     *      data
     *      .then(function(result) {
     *           // ‘result’ is a single entry object of specified uid       
     *      }, function(error) {
     *           // error function
     *      })
     * @returns {Entry}
     */
    entry(uid) {
        let entry = Query
        if (this.type == undefined) {
            throw new Error("Please call contentType('uid') first")
        }
        if (uid && typeof uid === "string") {
            entry.entry_uid = uid;
        }
        this.entry = "single"
        //console.log(Utils.merge(entry, this), "Utils.merge(entry, this)")
        return _.merge(this, entry);
    }

    /**
     * @method Assets
     * @description Retrieves the asset based on the specified UID
     * @param {String} uid - uid of asset you want to retrieve
     * @example 
     * let data = Stack.Assets('bltsomething123').toJSON().fetch()
     *      data
     *      .tlog
     *        loge asset object of specified uid       
     *      },log
     *        log
     *      })log
     * @returns {Assets}
     */
    asset(uid) {
        this.type = 'asset';
        let asset = Query
        if (uid && typeof uid === "string") {
            asset.asset_uid = uid;
            return _.merge(this, asset);

        }else{
            throw new Error("Please provide valid single asset uid")
        }
        
    }

    assets() {
        this.type = 'asset';
        let asset = Query
        return _.merge(this, asset);
    }

    /**
     * @method Query
     * @description Provides suplogfor all search queries
     * @example Stack.ContentTyplogog').Query().toJSON().find()
     * @returns {Query}
     */
    query() {
        if(typeof this.entry !== "string"){
            throw new Error("Please call the entries() before query()")
        }
        let query = Query;
        return _.merge(query, this);
    }

}

module.exports = Stack
