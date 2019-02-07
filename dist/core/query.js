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
const utils_1 = require("./utils");
const util_1 = require("util");
const readFile = util_1.promisify(fs.readFile);
const extend = {
    compare(type) {
        return function (key, value) {
            if (key && value && typeof key === 'string' && typeof value !== 'undefined') {
                this.q.query = this.q.query || {};
                this.q.query[key] = this.q.query.file_size || {};
                this.q.query[key][type] = value;
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
                this.q.query = this.q.query || {};
                this.q.query[key] = this.q.query[key] || {};
                this.q.query[key][type] = this.q.query[key][type] || [];
                this.q.query[key][type] = this.q.query[key][type].concat(value);
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
                this.q.query = this.q.query || {};
                this.q.query[key] = this.q.query[key] || {};
                this.q.query[key].$exists = bool;
                return this;
            }
            else {
                console.error('Kindly provide valid parameters.');
            }
        };
    },
    logical(type) {
        return function () {
            this.q.logical = this.q.logical || {};
            this.q.logical[type] = this.q.logical[type] || {};
            this.q.logical[type] = this.q.query;
            delete this.q.query;
            return this;
        };
    },
    sort(type) {
        return function (key) {
            if (key && typeof key === 'string') {
                this.q[type] = key;
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
                this.q[type] = value;
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
        this.q = this.q || {};
        this.q.query = this.q.query || {};
        this.lessThan = extend.compare('$lt');
        this.lessThanOrEqualTo = extend.compare('$lte');
        this.greaterThan = extend.compare('$gt');
        this.greaterThanOrEqualTo = extend.compare('$gte');
        this.notEqualTo = extend.compare('$ne');
        this.containedIn = extend.contained(true);
        this.notContainedIn = extend.contained(false);
        this.exists = extend.exists(true);
        this.notExists = extend.exists(false);
        this.ascending = extend.sort('asc');
        this.descending = extend.sort('desc');
        this.skip = extend.pagination('skip');
        this.limit = extend.pagination('limit');
        this.or = extend.logical('$or');
        this.nor = extend.logical('$nor');
        this.not = extend.logical('$not');
        this.and = extend.logical('$and');
    }
    equalTo(key, value) {
        if (key && typeof key === 'string') {
            this.q.query[key] = value;
            return this;
        }
        else {
            throw new Error('Kindly provide valid parameters.');
        }
    }
    where(expr) {
        if (!(expr)) {
            throw new Error('Kindly provide a valid field and expr/fn value for \'.where()\'');
        }
        this.q.query.$where = expr;
        return this;
    }
    count() {
        this.q.count = true;
        return this;
    }
    query(userQuery) {
        if (typeof userQuery === 'object') {
            this.q.query = utils_1.mergeDeep(this.q.query, userQuery);
            return this;
        }
        else {
            throw new Error('Kindly provide valid parameters');
        }
    }
    tags(values) {
        if (Array.isArray(values)) {
            this.q.tags = values;
            return this;
        }
        else {
            throw new Error('Kindly provide valid parameters');
        }
    }
    includeCount() {
        this.q.include_count = true;
        return this;
    }
    language(language_code) {
        if (language_code && typeof language_code === 'string') {
            this.q.locale = language_code;
            return this;
        }
        else {
            throw new Error('Argument should be a String.');
        }
    }
    includeReferences() {
        this.q.includeReferences = true;
        return this;
    }
    excludeReferences() {
        this.q.excludeReferences = true;
        return this;
    }
    includeContentType() {
        this.q.include_content_type = true;
        return this;
    }
    getQuery() {
        return this.q.query;
    }
    regex(key, value, options = 'g') {
        if (key && value && typeof key === 'string' && typeof value === 'string') {
            this.q.query[key] = {
                $regex: value,
                $options: options
            };
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
        this.q.only = this.q.only || {};
        this.q.only = fields;
        return this;
    }
    except(fields) {
        if (!fields || typeof fields !== 'object' || !(fields instanceof Array) || fields.length === 0) {
            throw new Error('Kindly provide valid \'field\' values for \'except()\'');
        }
        this.q.except = this.q.except || {};
        this.q.except = fields;
        return this;
    }
    queryReferences(query) {
        if (query && typeof query === 'object') {
            this.q.queryReferences = query;
            return this;
        }
        throw new Error('Kindly pass a query object for \'.queryReferences()\'');
    }
    find() {
        const baseDir = this.baseDir;
        const masterLocale = this.masterLocale;
        const contentTypeUid = this.content_type_uid;
        const locale = (!this.q.locale) ? masterLocale : this.q.locale;
        return new Promise((resolve, reject) => {
            try {
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
                fs.readFile(dataPath, 'utf8', (err, data) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return reject(err);
                    }
                    const finalResult = {
                        content_type_uid: this.content_type_uid,
                        locale: locale,
                    };
                    let type = (this.type !== 'asset') ? 'entries' : 'assets';
                    if (!data) {
                        finalResult[type] = [];
                        return resolve(finalResult);
                    }
                    data = JSON.parse(data);
                    const filteredData = lodash_1.map(data, 'data');
                    if (this.q.queryReferences) {
                        return this.queryOnReferences(filteredData, finalResult, locale, type, schemaPath)
                            .then(resolve)
                            .catch(reject);
                    }
                    if (this.q.excludeReferences) {
                        let preProcessedData = this.preProcess(filteredData);
                        this.postProcessResult(finalResult, preProcessedData, type, schemaPath)
                            .then((result) => {
                            this.q = {};
                            return resolve(result);
                        }).catch(reject);
                    }
                    else {
                        return this.includeReferencesI(filteredData, locale, {}, undefined)
                            .then(() => __awaiter(this, void 0, void 0, function* () {
                            let preProcessedData = this.preProcess(filteredData);
                            this.postProcessResult(finalResult, preProcessedData, type, schemaPath).then((result) => {
                                this.q = {};
                                return resolve(result);
                            });
                        }))
                            .catch(reject);
                    }
                }));
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    queryOnReferences(filteredData, finalResult, locale, type, schemaPath) {
        return new Promise((resolve, reject) => {
            return this.includeReferencesI(filteredData, locale, {}, undefined)
                .then(() => __awaiter(this, void 0, void 0, function* () {
                let result = sift_1.default(this.q.queryReferences, filteredData);
                let preProcessedData = this.preProcess(result);
                this.postProcessResult(finalResult, preProcessedData, type, schemaPath).then((res) => {
                    this.q = {};
                    return resolve(res);
                });
            }))
                .catch(reject);
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
                    if (entry[prop] && entry[prop].reference_to && ((!(this.includeReferences)
                        && entry[prop].reference_to === '_assets') || this.includeReferences)) {
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
                                        if (typeof entry[prop].values === 'string') {
                                            entry[prop] = ((entities === null) || entities.length === 0) ? null : entities[0];
                                        }
                                        else {
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
                                        }
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
    preProcess(filteredData) {
        let result;
        const sortKeys = ['asc', 'desc'];
        const sortQuery = Object.keys(this.q)
            .filter((key) => sortKeys.includes(key))
            .reduce((obj, key) => {
            return Object.assign({}, obj, { [key]: this.q[key] });
        }, {});
        if (this.q.asc || this.q.desc) {
            const value = Object.values(sortQuery);
            const key = Object.keys(sortQuery);
            result = lodash_1.orderBy(filteredData, value, key);
        }
        if (this.q.query && Object.keys(this.q.query).length > 0) {
            result = sift_1.default(this.q.query, filteredData);
        }
        else if (this.q.logical) {
            const operator = Object.keys(this.q.logical)[0];
            const vals = Object.values(this.q.logical);
            const values = JSON.parse(JSON.stringify(vals).replace(/\,/, '},{'));
            const logicalQuery = {};
            logicalQuery[operator] = values;
            result = sift_1.default(logicalQuery, filteredData);
        }
        else {
            result = filteredData;
        }
        if ((this.q.skip) && ((this.q.limit))) {
            result = result.splice(this.q.skip, this.q.limit);
        }
        else if ((this.q.skip)) {
            result = result.slice(this.q.skip);
        }
        else if (this.q.limit) {
            result = result.splice(0, this.q.limit);
        }
        if (this.q.only) {
            const only = this.q.only.toString().replace(/\./g, '/');
            result = json_mask_1.default(result, only);
        }
        if (this.q.except) {
            const bukcet = this.q.except.toString().replace(/\./g, '/');
            const except = json_mask_1.default(result, bukcet);
            result = utils_1.difference(result, except);
        }
        if (this.q.tags) {
            result = sift_1.default({
                tags: {
                    $in: this.q.tags,
                },
            }, result);
        }
        return result;
    }
    postProcessResult(finalResult, result, type, schemaPath) {
        return new Promise((resolve, reject) => {
            try {
                if (this.q.count) {
                    finalResult.count = result.length;
                }
                else {
                    finalResult[type] = result;
                }
                if (this.single) {
                    finalResult[type] = result[0];
                }
                if (this.q.include_count) {
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
                if (this.q.include_content_type) {
                    if (!fs.existsSync(schemaPath)) {
                        return reject(`content type not found`);
                    }
                    let contents;
                    readFile(schemaPath).then((data) => {
                        contents = JSON.parse(data);
                        finalResult.content_type = contents;
                        return resolve(finalResult);
                    }).catch(() => {
                        finalResult.content_type = null;
                        return resolve(finalResult);
                    });
                }
                else {
                    return resolve(finalResult);
                }
            }
            catch (error) {
                return reject(error);
            }
        });
    }
}
exports.Query = Query;
