/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

import {
  isEqual,
  isObject,
  transform,
} from 'lodash'
import { sync } from 'mkdirp'
import {
  isAbsolute,
  join,
} from 'path'
import { existsSync } from './fs'
import {
  getConfig,
} from './index'

const localePaths = {}

export const difference = (obj, baseObj) => {
  const changes = (data, base) => {
    return transform(data, (result, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value
      }
    })
  }

  return changes(obj, baseObj)
}

const buildPath = (pattern, data) => {
  const patternKeys = pattern.split('/')

  if (patternKeys[0] === '') {
    patternKeys.splice(0, 1)
  }

  const pathKeys = []
  for (let i = 0, keyLength = patternKeys.length; i < keyLength; i++) {
    if (patternKeys[i].charAt(0) === ':') {
      let k = patternKeys[i].substring(1)
      const idx = k.indexOf('.json')
      if (~idx) {
        k = k.slice(0, idx)
      }
      if (data[k]) {
        pathKeys.push(data[k])
      } else {
        throw new TypeError(`The key ${k} did not exist on ${JSON.stringify(data)}`)
      }
    } else {
      pathKeys.push(patternKeys[i])
    }
  }

  return join.apply(this, pathKeys)
}

export const getBaseDir = ({baseDir}) => {
  let contentDir: string
  if (isAbsolute(baseDir)) {
    if (!existsSync(baseDir)) {
      sync(baseDir)
    }
    contentDir = baseDir
  } else {
    const appPath = join(__dirname, '..', '..', '..')
    contentDir = join(appPath, baseDir)
    if (!existsSync(contentDir)) {
      sync(contentDir)
    }
  }

  return { contentDir }
}

/**
 * @public
 * @method getEntriesPath
 * @param contentTypeUid Content type - uid, who's entries are to be fetched
 * @param locale Locale from which the contents have to be read
 */
export const getEntriesPath = (locale, contentTypeUid) => {
  // if locale has been read, return data immediately
  if (localePaths.hasOwnProperty(locale)) {
    if (localePaths[locale].hasOwnProperty(contentTypeUid)) {
      return localePaths[locale][contentTypeUid]
    }
  } else {
    localePaths[locale] = {}
  }

  const data = {
    _content_type_uid: contentTypeUid,
    locale,
  }
  const config = getConfig().contentStore
  const { contentDir } = getBaseDir(config)
  const path = join(contentDir, buildPath(config.patterns.entries, data))
  localePaths[locale][contentTypeUid] = path

  return path
}

/**
 * @public
 * @method getAssetsPath
 * @param locale Locale from which the contents have to be read
 */
export const getAssetsPath = (locale) => {
  // if locale has been read, return data immediately
  if (localePaths.hasOwnProperty(locale)) {
    if (localePaths[locale].hasOwnProperty('_assets')) {
      // tslint:disable-next-line: no-string-literal
      return localePaths[locale]['_assets']
    }
  } else {
    localePaths[locale] = {}
  }

  const data = {
    _content_type_uid: '_assets',
    locale,
  }
  const config = getConfig().contentStore
  const { contentDir } = getBaseDir(config)
  const path = join(contentDir, buildPath(config.patterns.assets, data))
  // tslint:disable-next-line: no-string-literal
  localePaths[locale]['_assets'] = path

  return path
}

/**
 * @public
 * @method getContentTypesPath
 * @param locale Locale from which the contents have to be read
 */
export const getContentTypesPath = (locale) => {
  // if locale has been read, return data immediately
  if (localePaths.hasOwnProperty(locale)) {
    if (localePaths[locale].hasOwnProperty('_content_types')) {
      // tslint:disable-next-line: no-string-literal
      return localePaths[locale]['_content_types']
    }
  } else {
    localePaths[locale] = {}
  }
  const data = {
    _content_type_uid: '_content_types',
    locale,
  }
  const config = getConfig().contentStore
  const { contentDir } = getBaseDir(config)
  const path = join(contentDir, buildPath(config.patterns.content_types, data))
  // tslint:disable-next-line: no-string-literal
  localePaths[locale]['_content_types'] = path

  return path
}

interface IContentTypes {
  _assets?: any,
  _content_types?: any,
  [propName: string]: any,
}

export const segregateQueries = (queries) => {
  const aggQueries: IContentTypes = {}
  const contentTypes = []

  queries.forEach((element) => {
    if (element._content_type_uid) {
      if (aggQueries.hasOwnProperty(element._content_type_uid)) {
        aggQueries[element._content_type_uid].$or.push(element)
      } else {
        aggQueries[element._content_type_uid] = {
          $or: [element],
        }
        contentTypes.push(element._content_type_uid)
      }
    }
  })

  return {
    aggQueries,
    contentTypes,
  }
}

export const doNothingClause = function() {
  if (this.q.content_type_uid === this.types.content_types || this.q.content_type_uid ===
          this.types.assets || this.q.countOnly || this.q.excludeAllReferences ) {

            return true
          }

  return false
}
