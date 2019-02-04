"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const json_mask_1 = __importDefault(require("json-mask"));
const lodash_1 = require("lodash");
const path = __importStar(require("path"));
const sift_1 = __importDefault(require("sift"));
const util_1 = require("util");
const utils_1 = require("./utils");
const readFile = util_1.promisify(fs.readFile);
const _extend = {
    compare(type) {
        return function (key, value) {
            if (key && value && typeof key === 'string' && typeof value !== 'undefined') {
                this._query.query = this._query.query || {};
                this._query.query[key] = this._query.query.file_size || {};
                this._query.query[key][type] = value;
                return this;
            }
            else {
                console.error('Kindly provide valid parameters.');
            }
        };
    },
    contained(bool) {
        const type = (bool) ? '$in' : '$nin';
        return function (key, value) {
            if (key && value && typeof key === 'string' && Array.isArray(value)) {
                this._query.query = this._query.query || {};
                this._query.query[key] = this._query.query[key] || {};
                this._query.query[key][type] = this._query.query[key][type] || [];
                this._query.query[key][type] = this._query.query[key][type].concat(value);
                return this;
            }
            else {
                console.error('Kindly provide valid parameters.');
            }
        };
    },
    exists(bool) {
        return function (key) {
            if (key && typeof key === 'string') {
                this._query.query = this._query.query || {};
                this._query.query[key] = this._query.query[key] || {};
                this._query.query[key].$exists = bool;
                return this;
            }
            else {
                console.error('Kindly provide valid parameters.');
            }
        };
    },
    logical(type) {
        return function () {
            this._query.logical = this._query.logical || {};
            this._query.logical[type] = this._query.logical[type] || {};
            this._query.logical[type] = this._query.query;
            delete this._query.query;
            return this;
        };
    },
    sort(type) {
        return function (key) {
            if (key && typeof key === 'string') {
                this._query[type] = key;
                return this;
            }
            else {
                console.error('Argument should be a string.');
            }
        };
    },
    pagination(type) {
        return function (value) {
            if (typeof value === 'number') {
                this._query[type] = value;
                return this;
            }
            else {
                console.error('Argument should be a number.');
            }
        };
    },
};
class Query {
    constructor() {
        this.single = false;
        this._query = this._query || {};
        this._query.query = this._query.query || {};
        this.lessThan = _extend.compare('$lt');
        this.lessThanOrEqualTo = _extend.compare('$lte');
        this.greaterThan = _extend.compare('$gt');
        this.greaterThanOrEqualTo = _extend.compare('$gte');
        this.notEqualTo = _extend.compare('$ne');
        this.containedIn = _extend.contained(true);
        this.notContainedIn = _extend.contained(false);
        this.exists = _extend.exists(true);
        this.notExists = _extend.exists(false);
        this.ascending = _extend.sort('asc');
        this.descending = _extend.sort('desc');
        this.skip = _extend.pagination('skip');
        this.limit = _extend.pagination('limit');
        this.or = _extend.logical('$or');
        this.nor = _extend.logical('$nor');
        this.not = _extend.logical('$not');
        this.and = _extend.logical('$and');
    }
    equalTo(key, value) {
        if (key && typeof key === 'string') {
            this._query.query = this._query.query || {};
            this._query.query[key] = value;
            return this;
        }
        else {
            throw new Error('Kindly provide valid parameters.');
        }
    }
    where(key, value) {
        if (key && typeof key === 'string') {
            this._query.query = this._query.query || {};
            this._query.query[key] = value;
            return this;
        }
        else {
            throw new Error('Kindly provide valid parameters.');
        }
    }
    count() {
        this._query.count = true;
        return this;
    }
    query(query) {
        if (typeof query === 'object') {
            this._query.query = utils_1.mergeDeep(this._query.query, query);
            return this;
        }
        else {
            throw new Error('Kindly provide valid parameters');
        }
    }
    tags(values) {
        if (Array.isArray(values)) {
            this._query.tags = values;
            return this;
        }
        else {
            throw new Error('Kindly provide valid parameters');
        }
    }
    includeCount() {
        this._query.include_count = true;
        return this;
    }
    language(language_code) {
        if (language_code && typeof language_code === 'string') {
            this._query.locale = language_code;
            return this;
        }
        else {
            throw new Error('Argument should be a String.');
        }
    }
    includeReferences() {
        this._query.includeReferences = true;
        return this;
    }
    includeContentType() {
        this._query.include_content_type = true;
        return this;
    }
    addParam(key, value) {
        if (key && value && typeof key === 'string' && typeof value === 'string') {
            this._query[key] = value;
            return this;
        }
        else {
            throw new Error('Kindly provide valid parameters.');
        }
    }
    getQuery() {
        return this._query.query || {};
    }
    regex(key, value, options) {
        if (key && value && typeof key === 'string' && typeof value === 'string') {
            this._query.query[key] = {
                $regex: value,
            };
            if (options) {
                this._query.query[key].$options = options;
            }
            return this;
        }
        else {
            throw new Error('Kindly provide valid parameters.');
        }
    }
    only(fields) {
        if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'only()\'');
        }
        this._query.query = this._query.query || {};
        this._query.only = this._query.only || {};
        this._query.only = fields;
        return this;
    }
    except(fields) {
        if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'except()\'');
        }
        this._query.query = this._query.query || {};
        this._query.except = this._query.except || {};
        this._query.except = fields;
        return this;
    }
    find() {
        const baseDir = this.baseDir;
        const masterLocale = this.masterLocale;
        const contentTypeUid = this.content_type_uid;
        const locale = (!this._query.locale) ? masterLocale : this._query.locale;
        let result;
        return new Promise((resolve, reject) => {
            let dataPath;
            let schemaPath;
            if (this.type === 'asset') {
                dataPath = path.join(baseDir, locale, 'assets', '_assets.json');
            }
            else {
                dataPath = path.join(baseDir, locale, 'data', contentTypeUid, 'index.json');
                schemaPath = path.join(baseDir, locale, 'data', contentTypeUid, '_schema.json');
            }
            if (!fs.existsSync(dataPath)) {
                return reject(`${dataPath} didn't exist`);
            }
            else {
                fs.readFile(dataPath, 'utf8', (err, data) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        const finalResult = {
                            content_type_uid: this.content_type_uid,
                            locale: locale,
                        };
                        let type = (this.type !== 'asset') ? 'entries' : 'assets';
                        if (!data) {
                            finalResult[type] = [];
                            return resolve(finalResult);
                        }
                        const entryData = JSON.parse(data);
                        const filteredData = lodash_1.map(entryData, 'data');
                        if (this._query.includeReferences) {
                            return this.includeReferencesI(filteredData, locale, {}, undefined)
                                .then(() => __awaiter(this, void 0, void 0, function* () {
                                result = this.processResult(filteredData, finalResult, type, schemaPath);
                                return resolve(result);
                            }))
                                .catch(reject);
                        }
                        else {
                            result = this.processResult(filteredData, finalResult, type, schemaPath);
                            resolve(result);
                        }
                    }
                }));
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
    findReferences(query) {
        return new Promise((resolve, reject) => {
            let pth;
            if (query.content_type_uid === '_assets') {
                pth = path.join(this.baseDir, query.locale, 'assets', '_assets.json');
            }
            else {
                pth = path.join(this.baseDir, query.locale, 'data', query.content_type_uid, 'index.json');
            }
            if (!fs.existsSync(pth)) {
                return resolve([]);
            }
            return fs.readFile(pth, 'utf-8', (readError, data) => {
                if (readError) {
                    return reject(readError);
                }
                if (!data) {
                    return resolve();
                }
                data = JSON.parse(data);
                data = lodash_1.map(data, 'data');
                return resolve(data);
            });
        });
    }
    includeReferencesI(entry, locale, references, parentUid) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (entry === null || typeof entry !== 'object') {
                return resolve();
            }
            if (entry.uid) {
                parentUid = entry.uid;
            }
            const referencesFound = [];
            for (const prop in entry) {
                if (entry[prop] !== null && typeof entry[prop] === 'object') {
                    if (entry[prop] && entry[prop].reference_to) {
                        if (entry[prop].values.length === 0) {
                            entry[prop] = [];
                        }
                        else {
                            let uids = entry[prop].values;
                            if (typeof uids === 'string') {
                                uids = [uids];
                            }
                            if (entry[prop].reference_to !== '_assets') {
                                uids = lodash_1.filter(uids, (uid) => {
                                    return !(utils_1.checkCyclic(uid, references));
                                });
                            }
                            if (uids.length) {
                                const query = {
                                    content_type_uid: entry[prop].reference_to,
                                    locale,
                                    uid: {
                                        $in: uids,
                                    },
                                };
                                referencesFound.push(new Promise((rs, rj) => {
                                    return self.findReferences(query).then((entities) => {
                                        entities = lodash_1.cloneDeep(entities);
                                        if (entities.length === 0) {
                                            entry[prop] = [];
                                            return rs();
                                        }
                                        else if (parentUid) {
                                            references[parentUid] = references[parentUid] || [];
                                            references[parentUid] = lodash_1.uniq(references[parentUid].concat(lodash_1.map(entities, 'uid')));
                                        }
                                        const referenceBucket = [];
                                        query.uid.$in.forEach((entityUid) => {
                                            const elem = lodash_1.find(entities, (entity) => {
                                                return entity.uid === entityUid;
                                            });
                                            if (elem) {
                                                referenceBucket.push(elem);
                                            }
                                        });
                                        entry[prop] = referenceBucket;
                                        return self.includeReferencesI(entry[prop], locale, references, parentUid)
                                            .then(rs)
                                            .catch(rj);
                                    });
                                }));
                            }
                        }
                    }
                    else {
                        referencesFound.push(self.includeReferencesI(entry[prop], locale, references, parentUid));
                    }
                }
            }
            return Promise.all(referencesFound)
                .then(resolve)
                .catch(reject);
        });
    }
    processResult(filteredData, finalResult, type, schemaPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            const sortKeys = ['asc', 'desc'];
            const sortQuery = Object.keys(this._query)
                .filter((key) => sortKeys.includes(key))
                .reduce((obj, key) => {
                return Object.assign({}, obj, { [key]: this._query[key] });
            }, {});
            if (this._query.asc || this._query.desc) {
                const value = Object.values(sortQuery);
                const key = Object.keys(sortQuery);
                result = lodash_1.orderBy(filteredData, value, key);
            }
            if (this._query.query && Object.keys(this._query.query).length > 0) {
                result = sift_1.default(this._query.query, filteredData);
            }
            else if (this._query.logical) {
                const operator = Object.keys(this._query.logical)[0];
                const vals = Object.values(this._query.logical);
                const values = JSON.parse(JSON.stringify(vals).replace(/\,/, '},{'));
                const logicalQuery = {};
                logicalQuery[operator] = values;
                result = sift_1.default(logicalQuery, filteredData);
            }
            else {
                result = filteredData;
            }
            if (this._query.limit) {
                const limit = this._query.limit;
                result = result.splice(0, limit);
            }
            if (this._query.skip) {
                const skip = this._query.skip;
                result = result.slice(skip);
            }
            if (this._query.only) {
                const only = this._query.only.toString().replace(/\./g, '/');
                result = json_mask_1.default(result, only);
            }
            if (this._query.except) {
                const bukcet = this._query.except.toString().replace(/\./g, '/');
                const except = json_mask_1.default(result, bukcet);
                result = utils_1.difference(result, except);
            }
            if (this._query.count) {
                finalResult.count = result.length;
            }
            else {
                finalResult[type] = result;
            }
            if (this._query.include_count) {
                if (result === undefined) {
                    finalResult.count = 0;
                }
                else if (this.single) {
                    finalResult.count = 1;
                }
                else {
                    finalResult.count = result.length;
                }
            }
            if (this._query.include_content_type) {
                if (!fs.existsSync(schemaPath)) {
                    return (`${schemaPath} didn't exist`);
                }
                else {
                    let contents;
                    if (fs.existsSync(schemaPath)) {
                        contents = yield readFile(schemaPath);
                        if (!contents) {
                            finalResult.content_type = null;
                        }
                        else {
                            finalResult.content_type = JSON.parse(contents);
                        }
                    }
                }
            }
            if (this._query.tags) {
                result = sift_1.default({
                    tags: {
                        $in: this._query.tags,
                    },
                }, result);
                finalResult[type] = result(finalResult).count = result.length;
            }
            this._query = null;
            return finalResult;
        });
    }
}
exports.Query = Query;
