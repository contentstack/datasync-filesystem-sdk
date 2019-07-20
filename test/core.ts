/**
 * @description Test contentstack-mongodb-sdk basic methods
 */

import Debug from 'debug'
import { existsSync, writeFile } from 'fs'
import { cloneDeep } from 'lodash'
import { sync as mkdirSync } from 'mkdirp'
import { join, sep } from 'path'
import { sync as rimrafSync } from 'rimraf'
import { promisify } from 'util'
import { Contentstack } from '../src'
import { getAssetsPath, getContentTypesPath, getEntriesPath } from '../src/utils'
import { config } from './config'
import { assets } from './data/assets'
import { entries as authors } from './data/author'
import { entries as blogs } from './data/blog'
import { entries as categories } from './data/category'
import { content_types } from './data/content_types'
import { entries as products } from './data/products'

const debug = new Debug('test:core')
const writeFileP = promisify(writeFile)

const scriptConfig = cloneDeep(config)
scriptConfig.contentStore.baseDir = join(__dirname, '_testing_core')
const Stack = Contentstack.Stack(scriptConfig)

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
    debug('Connecting to Stack')
    expect(Stack).toHaveProperty('connect')

    return Stack.connect()
  })

  // Populate assets data for this test suite
  beforeAll(() => {
    if (!existsSync(scriptConfig.contentStore.baseDir)) {
      debug(`${scriptConfig.contentStore.baseDir} did not exist. Creating..`)
      mkdirSync(scriptConfig.contentStore.baseDir)
      debug(
        // tslint:disable-next-line: max-line-length
        `${scriptConfig.contentStore.baseDir} did not exist. Created successfully! ${existsSync(scriptConfig.contentStore.baseDir)}`,
        )
    }

    const asset = assets[0]
    const assetPath = getAssetsPath(asset.locale) + '.json'
    debug(`Asset path ${assetPath}`)
    const folderPath = assetPath.slice(0, assetPath.lastIndexOf(sep))
    if (!existsSync(folderPath)) {
      debug(`${folderPath} did not exist. Creating..`)
      mkdirSync(folderPath)
    }

    return writeFileP(assetPath, JSON.stringify(assets))
  })

  beforeAll(async () => {
    const product = products[1]
    const productPath = getEntriesPath(product.locale, product._content_type_uid) + '.json'
    debug(`Product path ${productPath}`)
    const productFolderPath = productPath.slice(0, productPath.lastIndexOf(sep))
    if (!existsSync(productFolderPath)) {
      debug(`${productFolderPath} did not exist. Creating..`)
      mkdirSync(productFolderPath)
    }
    debug(`Product path for es-es: ${productFolderPath}`)

    await writeFileP(productPath, JSON.stringify(products))
  })

  // Populate content type data for this test suite
  beforeAll(() => {
    const contentType = content_types[0]
    const contentTypePath = getContentTypesPath(contentType.locale) + '.json'
    const folderPath = contentTypePath.slice(0, contentTypePath.lastIndexOf(sep))
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath)
    }

    return writeFileP(contentTypePath, JSON.stringify(content_types))
  })

  // Populate entries data for this test suite
  beforeAll(async () => {
    const author = authors[0]
    const authorPath = getEntriesPath(author.locale, author._content_type_uid) + '.json'
    const authorFolderPath = authorPath.slice(0, authorPath.lastIndexOf(sep))
    if (!existsSync(authorFolderPath)) {
      mkdirSync(authorFolderPath)
    }

    await writeFileP(authorPath, JSON.stringify(authors))

    const blog = blogs[0]
    const blogPath = getEntriesPath(blog.locale, blog._content_type_uid) + '.json'
    const blogFolderPath = blogPath.slice(0, blogPath.lastIndexOf(sep))
    if (!existsSync(blogFolderPath)) {
      mkdirSync(blogFolderPath)
    }

    await writeFileP(blogPath, JSON.stringify(blogs))

    const category = categories[0]
    const categoryPath = getEntriesPath(category.locale, category._content_type_uid) + '.json'
    const categoryFolderPath = categoryPath.slice(0, categoryPath.lastIndexOf(sep))
    if (!existsSync(categoryFolderPath)) {
      mkdirSync(categoryFolderPath)
    }

    await writeFileP(categoryPath, JSON.stringify(categories))

    const product = products[0]
    const productPath = getEntriesPath(product.locale, product._content_type_uid) + '.json'
    const productFolderPath = productPath.slice(0, productPath.lastIndexOf(sep))
    if (!existsSync(productFolderPath)) {
      mkdirSync(productFolderPath)
    }

    await writeFileP(productPath, JSON.stringify(products))
  })

  // Destroy the data
  afterAll(() => {
    rimrafSync(scriptConfig.contentStore.baseDir)

    return
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
