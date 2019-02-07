"use strict";
/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */
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
class Stack {
    constructor(...stackArguments) {
        this.q = {};
        this.single = false;
        this.isEntry = false;
        this.baseDir;
        this.masterLocale;
        this.config = lodash_1.merge(default_1.defaultConfig, ...stackArguments);
    }
    connect(overrides = {}) {
        this.config = lodash_1.merge(this.config, overrides);
        return new Promise((resolve, reject) => {
            try {
                if (!this.config['options'].hasOwnProperty('base_dir')) {
                    throw new Error('Please provide base_dir to connect the filesystem.');
                }
                else if (!this.config.hasOwnProperty('locales') || this.config.locales.length === 0) {
                    throw new Error('Please provide locales with code and relative_url_prefix.\n Example ==> locales:[{code:"en-us",relative_ul_prefix:"/"}].');
                }
                else if (!(fs.existsSync(this.config['options'].base_dir))) {
                    throw new Error(`${this.config['options'].base_dir} didn't exits.`);
                }
                else {
                    this.baseDir = this.config['options'].base_dir;
                    this.masterLocale = this.config.locales[0].code;
                    return resolve(this.config['options']);
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    contentType(uid) {
        const stack = new Stack(this.config);
        stack.baseDir = this.baseDir;
        stack.masterLocale = this.masterLocale;
        if (!uid) {
            throw new Error("Please provide valid uid");
        }
        else if (uid && typeof uid === 'string') {
            stack.content_type_uid = uid;
            stack.type = 'contentType';
        }
        return stack;
    }
    entries() {
        const entry = new query_1.Query();
        this.isEntry = true;
        if (this.type === undefined) {
            throw new Error("Please call contentType('uid') first");
        }
        return lodash_1.merge(entry, this);
    }
    find() {
        const baseDir = this.baseDir;
        const masterLocale = this.masterLocale;
        const locale = (!this.q.locale) ? masterLocale : this.q.locale;
        let result;
        return new Promise((resolve, reject) => {
            if (this.type == 'asset') {
                const dataPath = path.join(baseDir, locale, 'assets', '_assets.json');
                if (!fs.existsSync(dataPath)) {
                    return reject(`asset not found`);
                }
                else {
                    fs.readFile(dataPath, 'utf8', (err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        const finalResult = {};
                        if (!data) {
                            finalResult.asset = null;
                            return resolve(finalResult);
                        }
                        const assetData = JSON.parse(data);
                        if (!this.asset_uid) {
                            finalResult.assets = [];
                            return resolve(finalResult);
                        }
                        result = lodash_1.find(assetData, { uid: this.asset_uid });
                        finalResult.asset = result;
                        return resolve(finalResult);
                    });
                }
            }
            else if (this.type !== 'asset' && !this.isEntry) {
                const dataPath = path.join(baseDir, locale, 'data', this.content_type_uid, '_schema.json');
                if (!fs.existsSync(dataPath)) {
                    return reject(`content type not found`);
                }
                fs.readFile(dataPath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    const finalResult = {
                        content_type_uid: this.content_type_uid,
                    };
                    if (!data) {
                        return resolve(finalResult.content_type = null);
                    }
                    const schema = JSON.parse(data);
                    finalResult.content_type = schema;
                    return resolve(finalResult);
                });
            }
            else {
                const dataPath = path.join(baseDir, locale, 'data', this.content_type_uid, 'index.json');
                if (!fs.existsSync(dataPath)) {
                    return reject(`content type not found`);
                }
                fs.readFile(dataPath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    const finalResult = {
                        content_type_uid: this.content_type_uid,
                        locale,
                    };
                    if (!data) {
                        finalResult.entry = null;
                        return resolve(finalResult);
                    }
                    const entryData = JSON.parse(data);
                    result = lodash_1.map(entryData, 'data');
                    if (!this.entry_uid) {
                        finalResult.entries = [];
                        return resolve(finalResult);
                    }
                    result = lodash_1.find(result, { uid: this.entry_uid });
                    finalResult.entry = result;
                    return resolve(finalResult);
                });
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
        const entry = new query_1.Query();
        this.isEntry = true;
        if (this.type === undefined) {
            throw new Error("Please call contentType('uid') first");
        }
        if (uid && typeof uid === 'string') {
            entry.entry_uid = uid;
        }
        return lodash_1.merge(this, entry);
    }
    asset(uid) {
        this.type = 'asset';
        const asset = new query_1.Query();
        if (uid && typeof uid === 'string') {
            asset.asset_uid = uid;
        }
        return lodash_1.merge(this, asset);
    }
    assets() {
        this.type = 'asset';
        const asset = new query_1.Query();
        return lodash_1.merge(asset, this);
    }
}
exports.Stack = Stack;
