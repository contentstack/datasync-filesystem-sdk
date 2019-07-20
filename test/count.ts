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

describe('# Count', () => {
  // Connect to DB
  beforeAll(() => {
    const output = init(Contentstack, config, 'count')
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

  describe('basic', () => {
    test('.count()', () => {
      return Stack.contentType('blog')
        .entries()
        .count()
        .then((result: any) => {
          debug(`# count-basic: entries result: ${JSON.stringify(result)}`)
          expect(result).toHaveProperty('count')
          expect(result.count).toEqual(5)
          expect(result).toHaveProperty('content_type_uid')
          expect(result.content_type_uid).toEqual('blog')
          expect(result).toHaveProperty('locale')
          expect(result.locale).toEqual('en-us')
          expect(Object.keys(result)).toHaveLength(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('querying and counting', () => {
    test('.count(), .include(), .queryReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .include(['authors'])
        .queryReferences({'authors.uid': 'a10'})
        .count()
        .then((result: any) => {
          debug(`# count-querying: result: ${JSON.stringify(result)}`)
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('count')
          expect(result).toHaveProperty('locale')
          expect(result.content_type_uid).toEqual('blog')
          expect(result.locale).toEqual('en-us')
          expect(result.count).toEqual(1)
          expect(Object.keys(result)).toHaveLength(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.count(), .includeReferences(), .queryReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeReferences()
        .queryReferences({'authors.uid': 'a10'})
        .count()
        .then((result: any) => {
          debug(`# count-querying: result: ${JSON.stringify(result)}`)
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('count')
          expect(result).toHaveProperty('locale')
          expect(result.content_type_uid).toEqual('blog')
          expect(result.locale).toEqual('en-us')
          expect(result.count).toEqual(1)
          expect(Object.keys(result)).toHaveLength(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

