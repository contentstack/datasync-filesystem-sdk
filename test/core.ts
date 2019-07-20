/**
 * @description Test contentstack-mongodb-sdk basic methods
 */

import Debug from 'debug'
import { existsSync, writeFile } from 'fs'
import { cloneDeep } from 'lodash'
import { sync as mkdirSync } from 'mkdirp'
import { join, sep } from 'path'
// import { sync as rimrafSync } from 'rimraf'
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
    const assetFolderPathKeys = assetPath.split(sep)
    debug(`Asset folder path keys ${assetFolderPathKeys}`)
    assetFolderPathKeys.splice(assetFolderPathKeys.length - 1)
    let folderPath = join.apply(this, assetFolderPathKeys)
    if (assetPath.charAt(0) !== folderPath.charAt(0)) {
      folderPath = assetPath.charAt(0) + folderPath
    }
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
    const productFolderPathKeys = productPath.split(sep)
    debug(`Product folder path keys ${productFolderPathKeys}`)
    productFolderPathKeys.splice(productFolderPathKeys.length - 1)
    let productFolderPath = join.apply(this, productFolderPathKeys)
    if (productPath.charAt(0) !== productFolderPath.charAt(0)) {
      productFolderPath = productPath.charAt(0) + productFolderPath
    }
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
    const contentTypeFolderPathKeys = contentTypePath.split(sep)
    contentTypeFolderPathKeys.splice(contentTypeFolderPathKeys.length - 1)
    const folderPath = join.apply(this, contentTypeFolderPathKeys)
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath)
    }

    return writeFileP(contentTypePath, JSON.stringify(content_types))
  })

  // Populate entries data for this test suite
  beforeAll(async () => {
    const author = authors[0]
    const authorPath = getEntriesPath(author.locale, author._content_type_uid) + '.json'
    const authorFolderPathKeys = authorPath.split(sep)
    authorFolderPathKeys.splice(authorFolderPathKeys.length - 1)
    const assetFolderPath = join.apply(this, authorFolderPathKeys)
    if (!existsSync(assetFolderPath)) {
      mkdirSync(assetFolderPath)
    }

    await writeFileP(authorPath, JSON.stringify(authors))

    const blog = blogs[0]
    const blogPath = getEntriesPath(blog.locale, blog._content_type_uid) + '.json'
    const blogFolderPathKeys = blogPath.split(sep)
    blogFolderPathKeys.splice(blogFolderPathKeys.length - 1)
    const blogFolderPath = join.apply(this, blogFolderPathKeys)
    if (!existsSync(blogFolderPath)) {
      mkdirSync(blogFolderPath)
    }

    await writeFileP(blogPath, JSON.stringify(blogs))

    const category = categories[0]
    const categoryPath = getEntriesPath(category.locale, category._content_type_uid) + '.json'
    const categoryFolderPathKeys = categoryPath.split(sep)
    categoryFolderPathKeys.splice(categoryFolderPathKeys.length - 1)
    const categoryFolderPath = join.apply(this, categoryFolderPathKeys)
    if (!existsSync(categoryFolderPath)) {
      mkdirSync(categoryFolderPath)
    }

    await writeFileP(categoryPath, JSON.stringify(categories))

    const product = products[0]
    const productPath = getEntriesPath(product.locale, product._content_type_uid) + '.json'
    const productFolderPathKeys = productPath.split(sep)
    productFolderPathKeys.splice(productFolderPathKeys.length - 1)
    const productFolderPath = join.apply(this, productFolderPathKeys)
    if (!existsSync(productFolderPath)) {
      mkdirSync(productFolderPath)
    }

    await writeFileP(productPath, JSON.stringify(products))
  })

  // Destroy the data
  afterAll(() => {
    // rimrafSync(scriptConfig.contentStore.baseDir)

    return
  })

  describe('# core-entries', () => {
    test('find', () => {
      return Stack.contentType('blog')
        .entries()
        .find()
        .then((result: any) => {
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
          // checkEntries(result)
          expect(result).toHaveProperty('entries')
          expect(result).toHaveProperty('locale')
          expect(result).toHaveProperty('content_type_uid')
          expect(result.locale).toEqual('es-es')
          expect(result.content_type_uid).toEqual('product')
          expect(result.entries).toHaveLength(1)
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
          expect(result).toHaveProperty('count')
          expect(result.count).toEqual(5)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('assets', () => {
    test('find', () => {
      return Stack.assets()
        .find()
        .then((result: any) => {
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
          expect(result).toHaveProperty('count')
          expect(result.count).toEqual(3)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('schemas', () => {
    test('find', () => {
      return Stack.schemas()
        .find()
        .then((result: any) => {
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
          expect(result).toHaveProperty('content_type')
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
          expect(result).toHaveProperty('count')
          expect(result).toHaveProperty('locale')
          expect(result.locale).toEqual('en-us')
          expect(result.count).toEqual(4)
          expect(Object.keys(result).length).toEqual(2)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('entry', () => {
    test('find', () => {
      return Stack.contentType('blog')
        .entry()
        .find()
        .then((result: any) => {
          expect(result).toHaveProperty('entry')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect(result.content_type_uid).toEqual('blog')
          expect(result.locale).toEqual('en-us')
          expect(result.entry).toHaveProperty('title')
          expect(result.entry).not.toHaveProperty('sys_keys')
          expect(result.entry).not.toHaveProperty('_version')
          expect(result.entry).not.toHaveProperty('content_type_uid')
          expect(result.entry).not.toHaveProperty('created_at')
          expect(result.entry).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('asset', () => {
    test('find', () => {
      return Stack.asset()
        .find()
        .then((result: any) => {
          expect(result).toHaveProperty('asset')
          expect(result).toHaveProperty('content_type_uid')
          expect(result).toHaveProperty('locale')
          expect(result.content_type_uid).toEqual('assets')
          expect(result.locale).toEqual('en-us')
          expect(result.asset).toHaveProperty('title')
          expect(result.asset).not.toHaveProperty('sys_keys')
          expect(result.asset).not.toHaveProperty('_version')
          expect(result.asset).not.toHaveProperty('content_type_uid')
          expect(result.asset).not.toHaveProperty('created_at')
          expect(result.asset).not.toHaveProperty('updated_at')
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('schema', () => {
    test('find', () => {
      return Stack.schema()
        .find()
        .then((result: any) => {
          expect(result).toHaveProperty('locale')
          expect(result).toHaveProperty('content_type')
          expect(result).toHaveProperty('content_type_uid')
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
          expect(result).toHaveProperty('count')
          expect(result.count).toEqual(4)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

