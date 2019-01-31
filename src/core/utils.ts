import {isEqual, isObject, transform, uniq} from 'lodash'

export const mergeDeep = (target, source) => {
    const self = this
    const _merge_recursive = function(target, source) {
        for (const key in source) {
            if (self._type(source[key]) == 'object' && self._type(target[key]) == self._type(source[key])) {
                _merge_recursive(target[key], source[key])
            } else if (self._type(source[key]) == 'array' && self._type(target[key]) == self._type(source[key])) {
                target[key] = target[key].concat(source[key])
            } else {
                target[key] = source[key]
            }
        }
    }
    _merge_recursive(target, source)
    return target
}

export const difference = (object, base) => {
    function changes(object, base) {
        return transform(object, function(result, value, key) {
            if (!isEqual(value, base[key])) {
                result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value
            }
        })
    }
    return changes(object, base)
}

export const checkCyclic = (uid, mapping) => {
    let flag = false
    let list = [uid]
    for (let i = 0; i < list.length; i++) {
      const parent = getParents(list[i], mapping)
      if (parent.indexOf(uid) !== -1) {
        flag = true
        break
      }
      list = uniq(list.concat(parent))
    }
  
    return flag
  }
  
  const getParents = (child, mapping) => {
    const parents = []
    for (const key in mapping) {
      if (mapping[key].indexOf(child) !== -1) {
        parents.push(key)
      }
    }
  
    return parents
  }