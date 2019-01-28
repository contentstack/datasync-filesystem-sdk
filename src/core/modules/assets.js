var Utils = require('../lib/utils')
// var Stack = require('../stack')
var Query = require('./query')
var fs = require('fs')
var path = require('path')
var sift = require('sift').default
/**
 * @summary Creates an instance of 'Assets'.
 * @description An initializer is responsible for creating Asset object.
 * @param {String} uid - uid of the asset
 * @example
 * let Assets = Contentstack.Stack().Assets('bltsomething123');
 * @returns {Assets}
 * @ignore
 */
class Assets {
    constructor() {
        this._query = {};        
        this.only = Utils.transform('only');
        return this;
    }

    toJSON() {
        this.tojson = true;
        return this;
    }

    

    fetch() {
        let baseDir = this.baseDir
        let masterLocale = (this.masterLocale === undefined) ? "en-us" : this.masterLocale
        let result
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(baseDir)) {
                return reject(`${baseDir} didn't exist`)
            } else {
                    let dataPath = (!this._query['locale'])? path.join(baseDir, masterLocale, "assets", "_assets.json"): path.join(baseDir, this._query['locale'], "assets", "_assets.json");
                    if (this.asset_uid) {
                        fs.readFile(dataPath, 'utf8', (err, data) => {
                            if (err) {
                                return reject(err)
                            } else {
                                let assetData= JSON.parse(data)
                                result= _.find(assetData, {"uid":this.asset_uid})
                                result = (this._query['count'])? result.length:  result
                                resolve(result)
                            }
                        })
                    } else {
                        console.error("Kindly provide an asset uid. e.g. .Assets('bltsomething123')");
                    }
            }

        })
    }
}

module.exports = new Assets();