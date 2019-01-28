var Utils = require('./lib/utils')
var Entry = new (require('./modules/entry'))()
var Assets = require('./modules/assets')
var Query = require('./modules/query')
//var Request = require('./lib/request')
var filesytem = require('fs')
var path = require('path')

class Stack {

    constructor(contentConnector) {
        this.baseDir
        this.masterLocale
        this.connector(contentConnector).then((connector) => {
            console.log(`Connected to ${path.resolve(connector.base_dir)} filesystem successfully!!`)
            this.baseDir = path.resolve(connector.base_dir)
            this.masterLocale = connector.master_language
        }).catch((err) => {
            console.log(`Failed to connect to filesytem due to ${err}`)
        })
    }

    connector(contentConnector) {
        return new Promise(function (resolve, reject) {
            if(!contentConnector.hasOwnProperty('base_dir'))
            {
                reject("Please provide base_dir to connect the filesystem")
            }
            if(filesytem.existsSync(contentConnector.base_dir))
            {
                resolve(contentConnector)
            }
            else{
                reject(`${contentConnector.base_dir} didn't exits`)
            }
        })
    }

    contentType(uid) {
        if (uid && typeof uid === 'string') {
            this.content_type_uid = uid;
            this.type = "contentType";
        }
        return this;
    }

    entries(...val){
        let entry = Entry
        if (Array.isArray(val)) {
            if (arguments.length) {
                for (let i = 0; i < arguments.length; i++) {
                    entry.entry_uid = [];
                    entry.entry_uid = entry.entry_uid.concat(arguments[i]);
                }
            }
            console.log(Utils.merge(entry, this),"Utils.merge(entry, this) if")
            return Utils.merge(entry, this)
        } else {
            console.log(Utils.merge(entry, this),"Utils.merge(entry, this) else")
            return Utils.merge(entry, this)
        }
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
    Entry(uid) {
        let entry = Entry
        if (uid && typeof uid === "string") {
            entry.entry_uid = uid;
        }
        console.log(Utils.merge(entry, this),"Utils.merge(entry, this)")
        return Utils.merge(entry, this);
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
    Assets(uid) {
        this.type = 'asset';
        if (uid && typeof uid === "string") {
            let asset = Assets
            asset.asset_uid = uid;
            return Utils.merge(asset, this);
        }
        return this;
    }

    /**
     * @method Query
     * @description Provides suplogfor all search queries
     * @example Stack.ContentTyplogog').Query().toJSON().find()
     * @returns {Query}
     */
    Query() {
        let query = Query;
        return Utils.merge(query, this);
    }

}

module.exports = Stack
