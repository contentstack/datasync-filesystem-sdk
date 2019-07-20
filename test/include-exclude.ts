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

const debug = new Debug('test:include-exclude')
const writeFileP = promisify(writeFile)

const scriptConfig = cloneDeep(config)
scriptConfig.contentStore.baseDir = join(__dirname, '_testing_include_exclude')
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

describe('# Include Exclude', () => {
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

