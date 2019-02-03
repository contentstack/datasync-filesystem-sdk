import {isEqual, isObject, transform, uniq} from 'lodash'

export const mergeDeep = (targett, sourcee) => {
    const self = this
    const mergeRrcursive = (target, source) => {
        for (const key in source) {
            if (self._type(source[key]) === 'object' && self._type(target[key]) === self._type(source[key])) {
                mergeRrcursive(target[key], source[key])
            } else if (self._type(source[key]) === 'array' && self._type(target[key]) === self._type(source[key])) {
                target[key] = target[key].concat(source[key])
            } else {
                target[key] = source[key]
            }
        }
    }
    mergeRrcursive(targett, sourcee)

    return targett
}

export const difference = (obj, basee) => {
    const changes = (object, base) => {
        return transform(object, (result, value, key) => {
            if (!isEqual(value, base[key])) {
                result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value
            }
        })
    }

    return changes(obj, basee)
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