"use strict";
/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports.difference = (obj, baseObj) => {
    const changes = (object, base) => {
        return lodash_1.transform(object, (result, value, key) => {
            if (!lodash_1.isEqual(value, base[key])) {
                result[key] = (lodash_1.isObject(value) && lodash_1.isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    };
    return changes(obj, baseObj);
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
