/**
 * @description Test contentstack-filesystem-sdk basic methods
 */

import { Contentstack } from '../src'
import { config } from './config'
import { assets } from './data/assets'
import { entries as authors } from './data/author'
import { entries as blogs } from './data/blog'
import { entries as categories } from './data/category'
import { content_types } from './data/content_types'
import { entries as products } from './data/products'
import { destroy, init, populateAssets, populateContentTypes, pupulateEntries } from './utils'

let Stack
let debug
let scriptConfig

const checkEntries = (result: any, locale: string = 'en-us') => {
  expect(result).toHaveProperty('entries')
  expect(result).toHaveProperty('locale')
  expect(result).toHaveProperty('content_type_uid')
  expect(result.locale).toEqual(locale)
  expect(result.entries instanceof Array).toBeTruthy()
  result.entries.forEach((item) => {
    expect(item).not.toHaveProperty('_content_type_uid')
  })
}

describe('# Logical Operator Querying', () => {
  // Connect to DB
  beforeAll(() => {
    const output = init(Contentstack, config, 'logical-operators')
    debug = output.debug
    Stack = output.Stack
    scriptConfig = output.scriptConfig
  })

  // Populate assets data for this test suite
  beforeAll(async () => {
    return await populateAssets(scriptConfig, debug, assets)
  })

  // Populate content type data for this test suite
  beforeAll(async () => {
    return await populateContentTypes(scriptConfig, debug, content_types)
  })

  // Populate entries data for this test suite
  beforeAll(async () => {
    // Authors
    await pupulateEntries(scriptConfig, debug, authors)
    // Blogs
    await pupulateEntries(scriptConfig, debug, blogs)
    // Categories
    await pupulateEntries(scriptConfig, debug, categories)
    // Products
    await pupulateEntries(scriptConfig, debug, products)
  })

  // Destroy populated data
  afterAll(() => {
    destroy(scriptConfig)
  })

  describe('on: non pre-existing operator', () => {
    test('.and()', () => {
      return Stack.contentType('blog')
        .entries()
        .and([{_content_type_uid: 'blog'}, {no: 1}])
        .find()
        .then((result: any) => {
          debug(`# logical-operators: $and result\n${JSON.stringify(result)}`)
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(1)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.or()', () => {
      return Stack.contentType('blog')
        .entries()
        .or([{_content_type_uid: 'blogs'}, {no: 1}])
        .find()
        .then((result: any) => {
          debug(`# logical-operators: $or result\n${JSON.stringify(result)}`)
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(1)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

  })

  describe('on: pre-existing operator', () => {
    test('.and()', () => {
      return Stack.contentType('blog')
        .entries()
        .and([{no: 1}])
        .and([{_content_type_uid: 'blogs'}])
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(0)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.or()', () => {
      return Stack.contentType('blog')
        .entries()
        .or([{no: 1}])
        .or([{_content_type_uid: 'blogs'}])
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(0)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

