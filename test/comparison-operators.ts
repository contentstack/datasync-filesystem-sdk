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

describe('# Comparison Operator Querying', () => {
  // Connect to DB
  beforeAll(() => {
    const output = init(Contentstack, config, 'comparison-operators')
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
    test('.lessThan()', () => {
      return Stack.contentType('blog')
        .entries()
        .lessThan('no', 1)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(0)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.lessThanOrEqualTo()', () => {
      return Stack.contentType('blog')
        .entries()
        .lessThanOrEqualTo('no', 0)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(0)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.notEqualTo()', () => {
      return Stack.contentType('blog')
        .entries()
        .notEqualTo('no', 0)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(4)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).not.toEqual(0)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.greaterThan()', () => {
      return Stack.contentType('blog')
        .entries()
        .greaterThan('no', 5)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toBeGreaterThan(5)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.greaterThanOrEqualTo()', () => {
      return Stack.contentType('blog')
        .entries()
        .greaterThanOrEqualTo('no', 6)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toBeGreaterThanOrEqual(6)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.containedIn()', () => {
      return Stack.contentType('blog')
        .entries()
        .containedIn('tags', ['last'])
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('tags')
            expect(entry.tags).toContain('last')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.notContainedIn()', () => {
      return Stack.contentType('blog')
        .entries()
        .notContainedIn('tags', ['last'])
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(4)
          result.entries.forEach((entry) => {
            if (entry.tags) {
              expect(entry.tags).not.toContain('last')
            }
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('on: pre-existing operator', () => {
    test('.lessThan() + .lessThanOrEqualTo()', () => {
      return Stack.contentType('blog')
        .entries()
        .lessThanOrEqualTo('no', 0)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(0)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.notEqualTo() + .greaterThan() + .greaterThanOrEqualTo()', () => {
      return Stack.contentType('blog')
        .entries()
        .notEqualTo('no', 0)
        .greaterThan('no', 5)
        .greaterThanOrEqualTo('no', 6)
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toBeGreaterThanOrEqual(6)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    // TODO
    // Should both work at the same time?
    // test('.containedIn() + .notContainedIn()', () => {
    //   return Stack.contentType('blog')
    //     .entries()
    //     .containedIn('tags', ['last'])
    //     .notContainedIn('tags', ['first'])
    //     .find()
    //     .then((result: any) => {
    //       checkEntries(result)
    //       expect(result.content_type_uid).toEqual('blog')
    //       expect(result.entries).toHaveLength(4)
    //       result.entries.forEach((entry) => {
    //         if (entry.tags) {
    //           expect(entry.tags).not.toContain('first')
    //         }
    //       })
    //     }).catch((error) => {
    //       expect(error).toBeNull()
    //     })
    // })
  })
})

