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

function fnWhere() {
  return (this.no === 1)
}

describe('# Expressional Operators', () => {
  // Connect to DB
  beforeAll(() => {
    const output = init(Contentstack, config, 'expressions')
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
    test('.where()', () => {
      return Stack.contentType('blog')
        .entries()
        .where(fnWhere)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(1)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.regex()', () => {
      return Stack.contentType('blog')
        .entries()
        .regex('title', '/^Blog Two$/', 'g')
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('title')
            expect(entry.title).toMatch(/^Blog Two$/)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

