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

describe('# Sorting', () => {
  // Connect to DB
  beforeAll(() => {
    const output = init(Contentstack, config, 'sorting')
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

  expect.extend({
    compareValue(value, compareValue, operator, strict = false) {
      // tslint:disable-next-line: one-variable-per-declaration
      let pass, comparison
      // if operator is true, value >= compareValue, else the opposite
      if (operator) {
        if (strict) {
          comparison = ' > '
          pass = value > compareValue
        } else {
          comparison = ' >= '
          pass = value >= compareValue
        }
      } else {
        if (strict) {
          comparison = ' < '
          pass = value < compareValue
        } else {
          comparison = ' <= '
          pass = value <= compareValue
        }
      }

      if (pass) {
        return {
          message: () =>
            `expected ${value} not to be ${comparison} than ${compareValue}`,
          pass: true,
        }
      } else {
        return {
          message: () =>
          `expected ${value} to be ${comparison} than ${compareValue}`,
          pass: false,
        }
      }
    },
  })

  describe('on field', () => {
    test('ascending', () => {
      return Stack.contentType('blog')
        .entries()
        .ascending('no')
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {

            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.no) as any).compareValue(result.entries[index + 1].no, false)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('descending', () => {
      return Stack.contentType('blog')
        .entries()
        .descending('no')
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.no) as any).compareValue(result.entries[index + 1].no, true)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('without field', () => {
    test('ascending', () => {
      return Stack.contentType('blog')
        .entries()
        .ascending()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.published_at) as any).compareValue(result.entries[index + 1].published_at, false)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('descending', () => {
      return Stack.contentType('blog')
        .entries()
        .descending()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.published_at) as any).compareValue(result.entries[index + 1].published_at, true)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('combination - without fields', () => {
    test('.ascending() + .descending()', () => {
      return Stack.contentType('blog')
        .entries()
        .ascending()
        .descending()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.published_at) as any).compareValue(result.entries[index + 1].published_at, true)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.descending() + .ascending()', () => {
      return Stack.contentType('blog')
        .entries()
        .descending()
        .ascending()
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.published_at) as any).compareValue(result.entries[index + 1].published_at, false)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('combination - with fields', () => {
    test('.ascending() + .descending()', () => {
      return Stack.contentType('blog')
        .entries()
        .ascending('no')
        .descending('no')
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.no) as any).compareValue(result.entries[index + 1].no, true)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.descending() + .ascending()', () => {
      return Stack.contentType('blog')
        .entries()
        .descending('no')
        .ascending('no')
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
          result.entries.forEach((entry, index) => {
            if (index === (result.entries.length - 1)) {
              index -= 1
            }
            (expect(entry.no) as any).compareValue(result.entries[index + 1].no, false)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

