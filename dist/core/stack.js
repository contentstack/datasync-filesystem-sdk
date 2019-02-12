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
        this.config = lodash_1.merge(default_1.defaultConfig, ...stackArguments);
    }
    connect(overrides = {}) {
        this.config = lodash_1.merge(this.config, overrides);
        return new Promise((resolve, reject) => {
            try {
                if (!this.config.hasOwnProperty('locales') || this.config.locales.length === 0) {
                    throw new Error('Please provide locales with code and relative_url_prefix.');
                }
                else if (!(fs.existsSync(this.config.contentStore.baseDir))) {
                    throw new Error(`${this.config.contentStore.baseDir} didn't exists.`);
                }
                else {
                    this.baseDir = this.config.contentStore.baseDir;
                    this.masterLocale = this.config.locales[0].code;
                    return resolve(this.config.contentStore);
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
            throw new Error('Please provide valid uid');
        }
        else if (uid && typeof uid === 'string') {
            stack.contentTypeUid = uid;
            stack.type = 'contentType';
        }
        return stack;
    }
    entries() {
        const entry = new query_1.Query();
        this.isEntry = true;
        if (this.type === undefined) {
            throw new Error('Please call contentType(\'uid\') first');
        }
        return lodash_1.merge(entry, this);
    }
    find() {
        const baseDir = this.baseDir;
        const masterLocale = this.masterLocale;
        const locale = (!this.q.locale) ? masterLocale : this.q.locale;
        let result;
        return new Promise((resolve, reject) => {
            if (this.type === 'asset') {
                const dataPath = path.join(baseDir, locale, 'assets', '_assets.json');
                if (!fs.existsSync(dataPath)) {
                    return reject('asset not found');
                }
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
                    result = lodash_1.find(assetData, { uid: this.assetUid });
                    finalResult.asset = result;
                    return resolve(finalResult);
                });
            }
            else {
                const dataPath = path.join(baseDir, locale, 'data', this.contentTypeUid, 'index.json');
                if (!fs.existsSync(dataPath)) {
                    return reject('content type not found');
                }
                fs.readFile(dataPath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    const finalResult = {
                        content_type_uid: this.contentTypeUid,
                        locale,
                    };
                    if (!data) {
                        finalResult.entry = null;
                        return resolve(finalResult);
                    }
                    const entryData = JSON.parse(data);
                    result = lodash_1.map(entryData, 'data');
                    result = lodash_1.find(result, { uid: this.entryUid });
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
            throw new Error('Please call contentType(\'uid\') first');
        }
        if (uid && typeof uid === 'string') {
            entry.entryUid = uid;
            return lodash_1.merge(this, entry);
        }
        this.single = true;
        return lodash_1.merge(entry, this);
    }
    asset(uid) {
        this.type = 'asset';
        const asset = new query_1.Query();
        if (uid && typeof uid === 'string') {
            asset.assetUid = uid;
            return lodash_1.merge(this, asset);
        }
        this.single = true;
        return lodash_1.merge(asset, this);
    }
    assets() {
        this.type = 'asset';
        const asset = new query_1.Query();
        return lodash_1.merge(asset, this);
    }
}
exports.Stack = Stack;
