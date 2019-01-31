"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports.mergeDeep = (target, source) => {
    const self = this;
    const _merge_recursive = function (target, source) {
        for (const key in source) {
            if (self._type(source[key]) == 'object' && self._type(target[key]) == self._type(source[key])) {
                _merge_recursive(target[key], source[key]);
            }
            else if (self._type(source[key]) == 'array' && self._type(target[key]) == self._type(source[key])) {
                target[key] = target[key].concat(source[key]);
            }
            else {
                target[key] = source[key];
            }
        }
    };
    _merge_recursive(target, source);
    return target;
};
exports.difference = (object, base) => {
    function changes(object, base) {
        return lodash_1.transform(object, function (result, value, key) {
            if (!lodash_1.isEqual(value, base[key])) {
                result[key] = (lodash_1.isObject(value) && lodash_1.isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(object, base);
};
//# sourceMappingURL=utils.js.map