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
        this.single = false;
        this.baseDir;
        this.masterLocale;
        this.config = lodash_1.merge(default_1.defaultConfig, ...stack_arguments);
    }
    connect(overrides = {}) {
        this.config = lodash_1.merge(this.config, overrides);
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
    entries() {
        const entry = query;
        this._entry = 'multiple';
        if (this.type == undefined) {
            throw new Error("Please call contentType('uid') first");
        }
        return lodash_1.merge(entry, this);
    }
    find() {
        const baseDir = this.baseDir;
        const masterLocale = this.masterLocale;
        const locale = (!this._query.locale) ? masterLocale : this._query.locale;
        let result;
        return new Promise((resolve, reject) => {
            if (this.type == 'asset') {
                const dataPath = path.join(baseDir, locale, 'assets', '_assets.json');
                if (!fs.existsSync(dataPath)) {
                    return reject(`${dataPath} didn't exist`);
                }
                else {
                    fs.readFile(dataPath, 'utf8', (err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        else {
                            const finalRes = {};
                            let type = (this.asset_uid) ? "asset" : "assets";
                            if (this.single) {
                                type = "asset";
                            }
                            if (!data) {
                                if (type == "asset") {
                                    finalRes[type] = null;
                                }
                                else {
                                    finalRes[type] = [];
                                }
                                return resolve(finalRes);
                            }
                            const assetData = JSON.parse(data);
                            if (this.asset_uid) {
                                result = lodash_1.find(assetData, { uid: this.asset_uid });
                                finalRes[type] = result;
                            }
                            else {
                                result = assetData;
                                finalRes[type] = result;
                            }
                            if (this.single) {
                                type = "asset";
                                finalRes[type] = result[0];
                            }
                            resolve(finalRes);
                        }
                    });
                }
            }
            else if (this.type !== "asset" && !this._entry) {
                const dataPath = path.join(baseDir, locale, 'data', this.content_type_uid, '_schema.json');
                fs.readFile(dataPath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        const finalRes = {
                            content_type_uid: this.content_type_uid,
                        };
                        if (!data) {
                            return resolve(finalRes['content_type'] = null);
                        }
                        let schema = JSON.parse(data);
                        finalRes['content_type'] = schema;
                        return resolve(finalRes);
                    }
                });
            }
            else {
                const dataPath = path.join(baseDir, locale, 'data', this.content_type_uid, 'index.json');
                if (!fs.existsSync(dataPath)) {
                    return reject(`${dataPath} didn't exist`);
                }
                else {
                    fs.readFile(dataPath, 'utf8', (err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        else {
                            const finalRes = {
                                content_type_uid: this.content_type_uid,
                                locale: locale,
                            };
                            let type = (this._entry == 'single') ? 'entry' : 'entries';
                            if (!data) {
                                if (type == "entry") {
                                    finalRes[type] = null;
                                }
                                else {
                                    finalRes[type] = [];
                                }
                                return resolve(finalRes);
                            }
                            const entryData = JSON.parse(data);
                            result = lodash_1.map(entryData, 'data');
                            if (this._entry == 'single') {
                                result = lodash_1.find(result, { uid: this.entry_uid });
                                finalRes[type] = result;
                                return resolve(finalRes);
                            }
                            if (this.single) {
                                type = "entry";
                                finalRes[type] = result[0];
                                return resolve(finalRes);
                            }
                            finalRes[type] = result;
                            return resolve(finalRes);
                        }
                    });
                }
            }
        });
    }
    findOne() {
        this.single = true;
        return new Promise((resolve, reject) => {
            this.find().then((result) => {
                return resolve(result);
            }).catch((error) => {
                return reject(error);
            });
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
        return lodash_1.merge(asset, this);
    }
}
exports.Stack = Stack;
//# sourceMappingURL=stack.js.map