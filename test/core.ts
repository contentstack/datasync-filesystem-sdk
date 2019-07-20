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

const checkAssets = (result: any, locale: string = 'en-us') => {
  expect(result).toHaveProperty('assets')
  expect(result).toHaveProperty('locale')
  expect(result).toHaveProperty('content_type_uid')
  expect(result.content_type_uid).toEqual('assets')
  expect(result.locale).toEqual(locale)
  expect(result.assets instanceof Array).toBeTruthy()
  result.assets.forEach((item) => {
    expect(item).not.toHaveProperty('_version')
    expect(item).not.toHaveProperty('_content_type_uid')
    expect(item).not.toHaveProperty('created_at')
    expect(item).not.toHaveProperty('updated_at')
  })
}

describe('# Core', () => {
  // Connect to DB
  beforeAll(() => {
    const output = init(Contentstack, config, 'core')
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

  // Populate spanish data
  beforeAll(async () => {
    // Spanish entries
    await pupulateEntries(scriptConfig, debug, products, products[1])
  })

  // Destroy populated data
  afterAll(() => {
    destroy(scriptConfig)
  })

  describe('# core-entries', () => {
    test('find', () => {
      return Stack.contentType('blog')
        .entries()
        .find()
        .then((result: any) => {
          debug(`# core: entries.find result: ${JSON.stringify(result)}`)
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(5)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('find - language', () => {
      return Stack.contentType('product')
        .entries()
        .language('es-es')
        .find()
        .then((result: any) => {
          debug(`# core: entries.find-language result: ${JSON.stringify(result)}`)
          // checkEntries(result)
          expect(result).toHaveProperty('entries')
          expect(result).toHaveProperty('locale')
          expect(result).toHaveProperty('content_type_uid')
          expect(result.locale).toEqual('es-es')
          expect(result.content_type_uid).toEqual('product')
          expect(result.entries).toHaveLength(2)
          expect(result.entries instanceof Array).toBeTruthy()
          result.entries.forEach((item) => {
            expect(item).not.toHaveProperty('_version')
            expect(item).not.toHaveProperty('_content_type_uid')
            expect(item).not.toHaveProperty('created_at')
            expect(item).not.toHaveProperty('updated_at')
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('findOne', () => {
      return Stack.contentType('blog')
        .entries()
        .findOne()
        .then((result: any) => {
          debug(`# core: entries.findOne result: ${JSON.stringify(result)}`)
          expect(result).toHaveProperty('entry')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect(result.content_type_uid).toEqual('blog')
          expect(result.locale).toEqual('en-us')
          expect(result.entry).toHaveProperty('title')
          expect(result.entry).not.toHaveProperty('_version')
          expect(result.entry).not.toHaveProperty('content_type_uid')
          expect(result.entry).not.toHaveProperty('created_at')
          expect(result.entry).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('count', () => {
      return Stack.contentType('blog')
        .entries()
        .count()
        .then((result: any) => {
          debug(`# core: entries.count result: ${JSON.stringify(result)}`)
          expect(result).toHaveProperty('count')
          expect(result.count).toEqual(5)
          expect(result).toHaveProperty('content_type_uid')
          expect(result.content_type_uid).toEqual('blog')
          expect(result).toHaveProperty('locale')
          expect(result.locale).toEqual('en-us')
          expect(Object.keys(result).length).toEqual(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('# core-assets', () => {
    test('find', () => {
      return Stack.assets()
        .find()
        .then((result: any) => {
          debug(`# core: assets.find result: ${JSON.stringify(result)}`)
          checkAssets(result)
          expect(result.assets).toHaveLength(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('findOne', () => {
      return Stack.assets()
        .findOne()
        .then((result: any) => {
          debug(`# core: assets.findOne result: ${JSON.stringify(result)}`)
          expect(result).toHaveProperty('asset')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect(result.content_type_uid).toEqual('assets')
          expect(result.locale).toEqual('en-us')
          expect(result.asset).toHaveProperty('title')
          expect(result.asset).not.toHaveProperty('_version')
          expect(result.asset).not.toHaveProperty('_content_type_uid')
          expect(result.asset).not.toHaveProperty('created_at')
          expect(result.asset).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('count', () => {
      return Stack.assets()
        .count()
        .then((result: any) => {
          debug(`# core: assets.count result: ${JSON.stringify(result)}`)
          expect(result).toHaveProperty('count')
          expect(result.count).toEqual(3)
          expect(result).toHaveProperty('content_type_uid')
          expect(result.content_type_uid).toEqual('assets')
          expect(result).toHaveProperty('locale')
          expect(result.locale).toEqual('en-us')
          expect(Object.keys(result).length).toEqual(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('# core-schemas', () => {
    test('find', () => {
      return Stack.schemas()
        .find()
        .then((result: any) => {
          debug(`# core: schemas.find result: ${JSON.stringify(result)}`)
          expect(result).toHaveProperty('locale')
          expect(result.locale).toEqual('en-us')
          expect(result).toHaveProperty('content_types')
          expect(result.content_type_uid).toEqual('content_types')
          expect(result.content_types instanceof Array).toBeTruthy()
          expect(result.content_types).toHaveLength(4)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('findOne', () => {
      return Stack.schemas()
        .findOne()
        .then((result: any) => {
          debug(`# core: schemas.findOne result: ${JSON.stringify(result)}`)
          expect(result).toHaveProperty('content_type')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect(result.content_type_uid).toEqual('content_types')
          expect(result.locale).toEqual('en-us')
          expect(result.content_type_uid).toEqual('content_types')
          expect(result.content_type).toHaveProperty('title')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('count', () => {
      return Stack.schemas()
        .count()
        .then((result: any) => {
          debug(`# core: schemas.count result: ${JSON.stringify(result)}`)
          expect(result).toHaveProperty('count')
          expect(result).toHaveProperty('locale')
          expect(result).toHaveProperty('content_type_uid')
          expect(result.locale).toEqual('en-us')
          expect(result.content_type_uid).toEqual('content_types')
          expect(result.count).toEqual(4)
          expect(Object.keys(result).length).toEqual(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('# core-entry', () => {
    test('find', () => {
      return Stack.contentType('blog')
        .entry()
        .find()
        .then((result: any) => {
          debug(`# core: entry.find result: ${JSON.stringify(result)}`)
          expect(result).toHaveProperty('entry')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect(result.content_type_uid).toEqual('blog')
          expect(result.locale).toEqual('en-us')
          expect(result.entry).toHaveProperty('title')
          expect(result.entry).not.toHaveProperty('_version')
          expect(result.entry).not.toHaveProperty('content_type_uid')
          expect(result.entry).not.toHaveProperty('created_at')
          expect(result.entry).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('# core-asset', () => {
    test('find', () => {
      return Stack.asset()
        .find()
        .then((result: any) => {
          debug(`# core: asset.find result: ${JSON.stringify(result)}`)
          expect(result).toHaveProperty('asset')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect(result.content_type_uid).toEqual('assets')
          expect(result.locale).toEqual('en-us')
          expect(result.asset).toHaveProperty('title')
          expect(result.asset).not.toHaveProperty('_version')
          expect(result.asset).not.toHaveProperty('content_type_uid')
          expect(result.asset).not.toHaveProperty('created_at')
          expect(result.asset).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('# core-schema', () => {
    test('find', () => {
      return Stack.schema()
        .find()
        .then((result: any) => {
          debug(`# core: schema.find result: ${JSON.stringify(result)}`)
          expect(result).toHaveProperty('locale')
          expect(result).toHaveProperty('content_type')
          expect(result).toHaveProperty('content_type_uid')
          expect(result.locale).toEqual('en-us')
          expect(result.content_type_uid).toEqual('content_types')
          expect(result.content_type).toHaveProperty('title')
          expect(result.content_type).not.toHaveProperty('_version')
          expect(result.content_type).not.toHaveProperty('content_type_uid')
          expect(result.content_type).not.toHaveProperty('created_at')
          expect(result.content_type).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})
