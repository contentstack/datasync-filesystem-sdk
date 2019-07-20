/**
 * @description Test contentstack-mongodb-sdk basic methods
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

let tempVariable

describe('# Conditional Operators', () => {
  // Connect to DB
  beforeAll(() => {
    const output = init(Contentstack, config, 'skip-limit')
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
    test('.limit(1)', () => {
      const limit = 1

      return Stack.contentType('blog')
        .entries()
        .limit(limit)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(limit)
          tempVariable = result.entries[0]
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.skip(1)', () => {
      const skip = 1

      return Stack.contentType('blog')
      .entries()
      .find()
      .then((r1) => {

        return Stack.contentType('blog')
        .entries()
        .skip(skip)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result).toHaveProperty('entries')
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength((r1 as any).entries.length - skip)
          result.entries.forEach((entry) => {
            expect(entry).not.toMatchObject(tempVariable)
          })
        })
      })
      .catch((error) => {
        expect(error).toBeNull()
      })
    })
  })

  describe('skip-limit combination', () => {
    test('.skip(1) + .limit(1)', () => {
      const skip = 1
      const limit = 1

      return Stack.contentType('blog')
      .entries()
      .find()
      .then((r1) => {

        return Stack.contentType('blog')
        .entries()
        .skip(skip)
        .limit(limit)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(limit)
          expect(result.entries[0]).not.toMatchObject((r1 as any).entries[0])
        })
      })
      .catch((error) => {
        expect(error).toBeNull()
      })
    })
  })
})

