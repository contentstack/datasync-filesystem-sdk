"use strict";
/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const path_1 = require("path");
const index_1 = require("./index");
const localePaths = {};
exports.difference = (obj, baseObj) => {
    const changes = (data, base) => {
        return lodash_1.transform(data, (result, value, key) => {
            if (!lodash_1.isEqual(value, base[key])) {
                result[key] = (lodash_1.isObject(value) && lodash_1.isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    };
    return changes(obj, baseObj);
};
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
                throw new TypeError(`The key ${pathKeys[i]} did not exist on ${JSON.stringify(data)}`);
            }
        }
        else {
            pathKeys.push(patternKeys[i]);
        }
    }
    return path_1.join.apply(this, pathKeys);
};
/**
 * @public
 * @method getEntriesPath
 * @param contentTypeUid Content type - uid, who's entries are to be fetched
 * @param locale Locale from which the contents have to be read
 */
exports.getEntriesPath = (locale, contentTypeUid) => {
    // if locale has been read, return data immediately
    if (localePaths.hasOwnProperty(locale)) {
        if (localePaths[locale].hasOwnProperty(contentTypeUid)) {
            return localePaths[locale][contentTypeUid];
        }
    }
    const data = {
        _content_type_uid: contentTypeUid,
        locale,
    };
    const config = index_1.getConfig().contentStore;
    const path = buildPath(config.patterns.entries, data);
    if (localePaths[locale]) {
        localePaths[locale][contentTypeUid] = path;
    }
    else {
        localePaths[locale] = {
            [contentTypeUid]: path,
        };
    }
    return path;
};
/**
 * @public
 * @method getAssetsPath
 * @param locale Locale from which the contents have to be read
 */
exports.getAssetsPath = (locale) => {
    // if locale has been read, return data immediately
    if (localePaths.hasOwnProperty(locale)) {
        if (localePaths[locale].hasOwnProperty('_assets')) {
            // tslint:disable-next-line: no-string-literal
            return localePaths[locale]['_assets'];
        }
    }
    const data = {
        _content_type_uid: '_assets',
        locale,
    };
    const config = index_1.getConfig().contentStore;
    const path = buildPath(config.patterns.entries, data);
    // tslint:disable-next-line: no-string-literal
    localePaths[locale]['_assets'] = path;
    return path;
};
/**
 * @public
 * @method getContentTypesPath
 * @param locale Locale from which the contents have to be read
 */
exports.getContentTypesPath = (locale) => {
    // if locale has been read, return data immediately
    if (localePaths.hasOwnProperty(locale)) {
        if (localePaths[locale].hasOwnProperty('_content_types')) {
            // tslint:disable-next-line: no-string-literal
            return localePaths[locale]['_content_types'];
        }
    }
    const data = {
        _content_type_uid: '_content_types',
        locale,
    };
    const config = index_1.getConfig().contentStore;
    const path = buildPath(config.patterns.content_types, data);
    // tslint:disable-next-line: no-string-literal
    localePaths[locale]['_content_types'] = path;
    return path;
};
exports.segregateQueries = (queries) => {
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
exports.checkCyclic = (uid, mapping) => {
    let flag = false;
    let list = [uid];
    for (const i of list) {
        const parent = getParents(i, mapping);
        if (parent.indexOf(uid) !== -1) {
            flag = true;
            break;
        }
        list = lodash_1.uniq(list.concat(parent));
    }
    return flag;
};
const getParents = (child, mapping) => {
    const parents = [];
    for (const key in mapping) {
        if (mapping[key].indexOf(child) !== -1) {
            parents.push(key);
        }
    }
    return parents;
};
