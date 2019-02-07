"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports._type = (val) => {
    let __typeof = typeof val;
    switch (__typeof) {
        case 'object':
            if (Array.isArray(val)) {
                __typeof = 'array';
            }
            break;
        default:
    }
    return __typeof;
};
exports.mergeDeep = (target, source) => {
    const self = this;
    const mergeRrcursive = (target, source) => {
        for (const key in source) {
            if (self._type(source[key]) === 'object' && self._type(target[key]) === self._type(source[key])) {
                mergeRrcursive(target[key], source[key]);
            }
            else if (self._type(source[key]) === 'array' && self._type(target[key]) === self._type(source[key])) {
                target[key] = target[key].concat(source[key]);
            }
            else {
                target[key] = source[key];
            }
        }
    };
    mergeRrcursive(target, source);
    return target;
};
exports.difference = (obj, base) => {
    const changes = (object, base) => {
        return lodash_1.transform(object, (result, value, key) => {
            if (!lodash_1.isEqual(value, base[key])) {
                result[key] = (lodash_1.isObject(value) && lodash_1.isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    };
    return changes(obj, base);
};
exports.checkCyclic = (uid, mapping) => {
    let flag = false;
    let list = [uid];
    for (let i = 0; i < list.length; i++) {
        const parent = getParents(list[i], mapping);
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
