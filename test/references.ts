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

describe('# References', () => {
  // Connect to DB
  beforeAll(() => {
    const output = init(Contentstack, config, 'references')
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

  describe('# references-basic', () => {
    test('.includeReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeReferences()
        .find()
        .then((result: any) => {
          debug(`# references-basic: .includeReferences result\n${JSON.stringify(result)}`)
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('authors')
            if (entry.authors instanceof Array) {
              entry.authors.forEach((elem) => {
                expect(elem).toHaveProperty('uid')
                expect(elem).toHaveProperty('title')
                expect(elem).not.toHaveProperty('_content_type_uid')
              })
            } else {
              expect(entry.authors).toHaveProperty('uid')
              expect(entry.authors).toHaveProperty('title')
              expect(entry.authors).not.toHaveProperty('_content_type_uid')
            }
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.queryOnReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .include(['authors'])
        .queryReferences({'authors.uid': 'a10'})
        .find()
        .then((result: any) => {
          debug(`# references-basic: .queryOnReferences result\n${JSON.stringify(result)}`)
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('authors')
            expect(entry.authors).toHaveProperty('uid')
            expect(entry.authors.uid).toEqual('a10')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.include()', () => {
      return Stack.contentType('blog')
        .entries()
        .include(['authors'])
        .find()
        .then((result: any) => {
          debug(`# references-basic: .include result\n${JSON.stringify(result)}`)
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry) => {
            if (entry.hasOwnProperty('self_reference')) {
              expect(entry).toHaveProperty('self_reference')
              expect(entry.self_reference instanceof Array).toBeTruthy()
              entry.self_reference.forEach((ref) => {
                expect(ref).toHaveProperty('_content_type_uid')
                expect(ref).toHaveProperty('uid')
              })
            }

            if (entry.hasOwnProperty('authors')) {
              expect(entry).toHaveProperty('authors')
              if (entry.authors instanceof Array) {
                entry.authors.forEach((ref) => {
                  expect(ref).toHaveProperty('title')
                  expect(ref).toHaveProperty('uid')
                  expect(ref).not.toHaveProperty('_version')
                })
              } else {
                expect(entry.authors).toHaveProperty('title')
                expect(entry.authors).toHaveProperty('uid')
                expect(entry.authors).not.toHaveProperty('_version')
              }
            }
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

