"use strict";
/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.doNothingClause = exports.segregateQueries = exports.getContentTypesPath = exports.getAssetsPath = exports.getEntriesPath = exports.getBaseDir = exports.difference = void 0;
const lodash_1 = require("lodash");
const mkdirp_1 = require("mkdirp");
const path_1 = require("path");
const fs_1 = require("./fs");
const index_1 = require("./index");
const localePaths = Object.create(null);
const difference = (obj, baseObj) => {
    const changes = (data, base) => {
        return (0, lodash_1.transform)(data, (result, value, key) => {
            if (!(0, lodash_1.isEqual)(value, base[key])) {
                result[key] = ((0, lodash_1.isObject)(value) && (0, lodash_1.isObject)(base[key])) ? changes(value, base[key]) : value;
            }
        });
    };
    return changes(obj, baseObj);
};
exports.difference = difference;
const buildPath = (pattern, data) => {
    const patternKeys = pattern.split('/');
    if (patternKeys[0] === '') {
        patternKeys.splice(0, 1);
    }
    const pathKeys = [];
    for (let i = 0, keyLength = patternKeys.length; i < keyLength; i++) {
        if (patternKeys[i].charAt(0) === ':') {
            let k = patternKeys[i].substring(1);
            const idx = k.indexOf('.json');
            if (~idx) {
                k = k.slice(0, idx);
            }
            if (data[k]) {
                pathKeys.push(data[k]);
            }
            else {
                throw new TypeError(`The key ${k} did not exist on ${JSON.stringify(data)}`);
            }
        }
        else {
            pathKeys.push(patternKeys[i]);
        }
    }
    return path_1.join.apply(this, pathKeys);
};
const getBaseDir = ({ baseDir }) => {
    let contentDir;
    if ((0, path_1.isAbsolute)(baseDir)) {
        if (!(0, fs_1.existsSync)(baseDir)) {
            (0, mkdirp_1.sync)(baseDir);
        }
        contentDir = baseDir;
    }
    else {
        const appPath = (0, path_1.join)(__dirname, '..', '..', '..');
        contentDir = (0, path_1.join)(appPath, baseDir);
        if (!(0, fs_1.existsSync)(contentDir)) {
            (0, mkdirp_1.sync)(contentDir);
        }
    }
    return { contentDir };
};
exports.getBaseDir = getBaseDir;
/**
 * @public
 * @method getEntriesPath
 * @param contentTypeUid Content type - uid, who's entries are to be fetched
 * @param locale Locale from which the contents have to be read
 */
const getEntriesPath = (locale, contentTypeUid) => {
    // if locale has been read, return data immediately
    if (locale in localePaths) {
        if (localePaths[locale].hasOwnProperty(contentTypeUid)) {
            return localePaths[locale][contentTypeUid];
        }
    }
    else {
        localePaths[locale] = {};
    }
    const data = {
        _content_type_uid: contentTypeUid,
        locale,
    };
    const config = (0, index_1.getConfig)().contentStore;
    const { contentDir } = (0, exports.getBaseDir)(config);
    const path = (0, path_1.join)(contentDir, buildPath(config.patterns.entries, data));
    localePaths[locale][contentTypeUid] = path;
    return path;
};
exports.getEntriesPath = getEntriesPath;
/**
 * @public
 * @method getAssetsPath
 * @param locale Locale from which the contents have to be read
 */
const getAssetsPath = (locale) => {
    // if locale has been read, return data immediately
    if (locale in localePaths) {
        if (localePaths[locale].hasOwnProperty('_assets')) {
            // tslint:disable-next-line: no-string-literal
            return localePaths[locale]['_assets'];
        }
    }
    else {
        localePaths[locale] = {};
    }
    const data = {
        _content_type_uid: '_assets',
        locale,
    };
    const config = (0, index_1.getConfig)().contentStore;
    const { contentDir } = (0, exports.getBaseDir)(config);
    const path = (0, path_1.join)(contentDir, buildPath(config.patterns.assets, data));
    // tslint:disable-next-line: no-string-literal
    localePaths[locale]['_assets'] = path;
    return path;
};
exports.getAssetsPath = getAssetsPath;
/**
 * @public
 * @method getContentTypesPath
 * @param locale Locale from which the contents have to be read
 */
const getContentTypesPath = (locale) => {
    // if locale has been read, return data immediately
    if (locale in localePaths) {
        if (localePaths[locale].hasOwnProperty('_content_types')) {
            // tslint:disable-next-line: no-string-literal
            return localePaths[locale]['_content_types'];
        }
    }
    else {
        localePaths[locale] = {};
    }
    const data = {
        _content_type_uid: '_content_types',
        locale,
    };
    const config = (0, index_1.getConfig)().contentStore;
    const { contentDir } = (0, exports.getBaseDir)(config);
    const path = (0, path_1.join)(contentDir, buildPath(config.patterns.content_types, data));
    // tslint:disable-next-line: no-string-literal
    localePaths[locale]['_content_types'] = path;
    return path;
};
exports.getContentTypesPath = getContentTypesPath;
const segregateQueries = (queries) => {
    const aggQueries = {};
    const contentTypes = [];
    queries.forEach((element) => {
        if (element._content_type_uid) {
            if (aggQueries.hasOwnProperty(element._content_type_uid)) {
                aggQueries[element._content_type_uid].$or.push(element);
            }
            else {
                aggQueries[element._content_type_uid] = {
                    $or: [element],
                };
                contentTypes.push(element._content_type_uid);
            }
        }
    });
    return {
        aggQueries,
        contentTypes,
    };
};
exports.segregateQueries = segregateQueries;
const doNothingClause = function () {
    if (this.q.content_type_uid === this.types.content_types || this.q.content_type_uid ===
        this.types.assets || this.q.countOnly || this.q.excludeAllReferences) {
        return true;
    }
    return false;
};
exports.doNothingClause = doNothingClause;
