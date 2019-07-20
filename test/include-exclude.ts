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
    expect(item).not.toHaveProperty('_version')
    expect(item).not.toHaveProperty('_content_type_uid')
    expect(item).not.toHaveProperty('created_at')
    expect(item).not.toHaveProperty('updated_at')
  })
}

describe('# Include Exclude', () => {
  // Connect to DB
  beforeAll(() => {
    const output = init(Contentstack, config, 'include-exclude')
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

  describe('basic inclusion', () => {
    test('1 .includeCount()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeCount()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          expect(result).toHaveProperty('count')
          expect(result.count).toEqual(5)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('2 .includeSchema()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeContentType()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          expect(result).toHaveProperty('content_type')
          expect(result.content_type).toHaveProperty('uid')
          expect(result.content_type).toHaveProperty('title')
          expect(result.content_type).toHaveProperty('schema')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('3 .excludeReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .excludeReferences()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry) => {
            if (entry.hasOwnProperty('authors')) {
              if (entry.authors instanceof Array) {
                entry.authors.forEach((ref) => {
                  expect(ref).toHaveProperty('_content_type_uid')
                  expect(ref).toHaveProperty('uid')
                })
              } else {
                expect(entry.authors).toHaveProperty('_content_type_uid')
                expect(entry.authors).toHaveProperty('uid')
              }
            }
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('combination of include-exclude', () => {
    test('1 .includeCount() + .includeSchema() + .excludeReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeCount()
        .includeContentType()
        .excludeReferences()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          expect(result).toHaveProperty('count')
          expect(result.count).toEqual(5)
          expect(result).toHaveProperty('content_type')
          expect(result.content_type).toHaveProperty('uid')
          expect(result.content_type).toHaveProperty('title')
          expect(result.content_type).toHaveProperty('schema')
          result.entries.forEach((entry) => {
            if (entry.authors && entry.authors instanceof Array) {
              entry.authors.forEach((ref) => {
                expect(ref).toHaveProperty('_content_type_uid')
                expect(ref).toHaveProperty('uid')
                expect(ref._content_type_uid).toEqual('author')
              })
            } else {
              expect(entry.authors).toHaveProperty('_content_type_uid')
              expect(entry.authors).toHaveProperty('uid')
              expect(entry.authors._content_type_uid).toEqual('author')
            }
            expect(entry).toHaveProperty('no')
          })
        }).catch((error) => {
          console.error(error)
          expect(error).toBeNull()
        })
    })
  })
})

