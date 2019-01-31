"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const lodash_1 = require("lodash");
const path = __importStar(require("path"));
const default_1 = require("./default");
const query_1 = require("./query");
let query = new query_1.Query();
class Stack {
    constructor(...stack_arguments) {
        this._query = {};
        this.baseDir;
        this.masterLocale;
        this.config = lodash_1.merge(default_1.defaultConfig, ...stack_arguments);
    }
    connect() {
        return new Promise((resolve, reject) => {
            try {
                if (!this.config['content-connector'].hasOwnProperty('base_dir')) {
                    throw new Error('Please provide base_dir to connect the filesystem.');
                }
                else if (!this.config.hasOwnProperty('locales') || this.config.locales.length == 0) {
                    throw new Error('Please provide locales with code and relative_url_prefix.\n Example ==> locales:[{code:"en-us",relative_ul_prefix:"/"}].');
                }
                else if (!(fs.existsSync(this.config['content-connector'].base_dir))) {
                    throw new Error(`${this.config['content-connector'].base_dir} didn't exits.`);
                }
                else {
                    this.baseDir = this.config['content-connector'].base_dir;
                    this.masterLocale = this.config.locales[0].code;
                    return resolve(this.config['content-connector']);
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    contentType(uid) {
        if (this.baseDir == undefined) {
            throw new Error('Please call the Stack.connect() first');
        }
        if (uid && typeof uid === 'string') {
            this.content_type_uid = uid;
            this.type = 'contentType';
        }
        return this;
    }
    entries(...val) {
        const entry = query;
        this._entry = 'multiple';
        if (this.type == undefined) {
            throw new Error("Please call contentType('uid') first");
        }
        if (val.length > 0) {
            if (arguments.length) {
                for (let i = 0; i < arguments.length; i++) {
                    entry['entry_uid'] = [];
                    entry['entry_uid'] = entry['entry_uid'].concat(arguments[i]);
                }
            }
            return lodash_1.merge(this, entry);
        }
        else {
            return lodash_1.merge(entry, this);
        }
    }
    find() {
        const baseDir = this.baseDir;
        const masterLocale = this.masterLocale;
        let result;
        return new Promise((resolve, reject) => {
            if (this.type == 'asset') {
                const dataPath = (!this._query.locale) ? path.join(baseDir, masterLocale, 'assets', '_assets.json') : path.join(baseDir, this._query.locale, 'assets', '_assets.json');
                if (!fs.existsSync(dataPath)) {
                    return reject(`${dataPath} didn't exist`);
                }
                else {
                    fs.readFile(dataPath, 'utf8', (err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        else {
                            const assetData = JSON.parse(data);
                            const finalRes = {};
                            if (this.asset_uid) {
                                result = lodash_1.find(assetData, { uid: this.asset_uid });
                                finalRes['asset'] = result;
                            }
                            else {
                                result = assetData;
                                finalRes['assets'] = result;
                            }
                            resolve(finalRes);
                        }
                    });
                }
            }
            else {
                const dataPath = (!this._query.locale) ? path.join(baseDir, masterLocale, 'data', this.content_type_uid, 'index.json') : path.join(baseDir, this._query.locale, 'data', this.content_type_uid, 'index.json');
                if (!fs.existsSync(dataPath)) {
                    return reject(`${dataPath} didn't exist`);
                }
                else {
                    fs.readFile(dataPath, 'utf8', (err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        else {
                            const entryData = JSON.parse(data);
                            const finalRes = {
                                content_type_uid: entryData[0].content_type_uid,
                                locale: entryData[0].locale,
                            };
                            if (Object.keys(this._query).length === 0) {
                                result = lodash_1.map(entryData, 'content_type');
                                finalRes['content_type'] = result;
                                return resolve(finalRes);
                            }
                            else {
                                result = lodash_1.map(entryData, 'data');
                            }
                            if (this._entry == 'multiple') {
                                finalRes['entries'] = result;
                                return resolve(finalRes);
                            }
                            else if (this._entry == 'single') {
                                result = lodash_1.find(result, { uid: this.entry_uid });
                                finalRes['entry'] = result;
                                return resolve(finalRes);
                            }
                        }
                    });
                }
            }
        });
    }
    entry(uid) {
        const entry = query;
        if (this.type == undefined) {
            throw new Error("Please call contentType('uid') first");
        }
        if (uid && typeof uid === 'string') {
            entry['entry_uid'] = uid;
        }
        this._entry = 'single';
        return lodash_1.merge(this, entry);
    }
    asset(uid) {
        this.type = 'asset';
        const asset = query;
        if (uid && typeof uid === 'string') {
            asset['asset_uid'] = uid;
            return lodash_1.merge(this, asset);
        }
        else {
            throw new Error('Please provide valid single asset uid');
        }
    }
    assets() {
        this.type = 'asset';
        const asset = query;
        return lodash_1.merge(this, asset);
    }
    query() {
        const _query = query;
        return lodash_1.merge(_query, this);
    }
}
exports.Stack = Stack;
//# sourceMappingURL=stack.js.map