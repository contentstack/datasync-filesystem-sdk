/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

import {isEqual, isObject, transform, uniq} from 'lodash'

export const difference = (obj, baseObj) => {
    const changes = (object, base) => {
        return transform(object, (result, value, key) => {
            if (!isEqual(value, base[key])) {
                result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value
            }
        })
    }

    return changes(obj, baseObj)
}

export const checkCyclic = (uid, mapping) => {
    let flag = false
    let list = [uid]
    for (const i of list) {
      const parent = getParents(i, mapping)
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
