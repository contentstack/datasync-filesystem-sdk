"use strict";
/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
exports.difference = function (obj, baseObj) {
    var changes = function changes(object, base) {
        return lodash_1.transform(object, function (result, value, key) {
            if (!lodash_1.isEqual(value, base[key])) {
                result[key] = lodash_1.isObject(value) && lodash_1.isObject(base[key]) ? changes(value, base[key]) : value;
            }
        });
    };
    return changes(obj, baseObj);
};
exports.checkCyclic = function (uid, mapping) {
    var flag = false;
    var list = [uid];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            var parent = getParents(i, mapping);
            if (parent.indexOf(uid) !== -1) {
                flag = true;
                break;
            }
            list = lodash_1.uniq(list.concat(parent));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return flag;
};
var getParents = function getParents(child, mapping) {
    var parents = [];
    for (var key in mapping) {
        if (mapping[key].indexOf(child) !== -1) {
            parents.push(key);
        }
    }
    return parents;
};