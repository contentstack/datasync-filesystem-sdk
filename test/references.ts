/**
 * @description Test contentstack-mongodb-sdk basic methods
 */

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

const writeFileP = promisify(writeFile)

const scriptConfig = cloneDeep(config)
scriptConfig.contentStore.baseDir = join(__dirname, '_testing_references')
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

describe('# References', () => {
  // Connect to DB
  beforeAll(() => {
    return Stack.connect()
  })

  // Populate assets data for this test suite
  beforeAll(() => {
    if (!existsSync(scriptConfig.contentStore.baseDir)) {
      mkdirSync(scriptConfig.contentStore.baseDir)
    }

    const asset = assets[0]
    const assetPath = getAssetsPath(asset.locale) + '.json'
    const assetFolderPathKeys = assetPath.split(sep)
    assetFolderPathKeys.splice(assetFolderPathKeys.length - 1)
    const folderPath = join.apply(this, assetFolderPathKeys)
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath)
    }

    return writeFileP(assetPath, JSON.stringify(assets))
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

    await writeFileP(blogPath, JSON.stringify(blog))

    const category = categories[0]
    const categoryPath = getEntriesPath(category.locale, category._content_type_uid) + '.json'
    const categoryFolderPathKeys = categoryPath.split(sep)
    categoryFolderPathKeys.splice(categoryFolderPathKeys.length - 1)
    const categoryFolderPath = join.apply(this, categoryFolderPathKeys)
    if (!existsSync(categoryFolderPath)) {
      mkdirSync(categoryFolderPath)
    }

    await writeFileP(categoryPath, JSON.stringify(category))

    const product = products[0]
    const productPath = getEntriesPath(product.locale, product._content_type_uid) + '.json'
    const productFolderPathKeys = productPath.split(sep)
    productFolderPathKeys.splice(productFolderPathKeys.length - 1)
    const productFolderPath = join.apply(this, productFolderPathKeys)
    if (!existsSync(productFolderPath)) {
      mkdirSync(productFolderPath)
    }

    await writeFileP(productPath, JSON.stringify(product))
  })

  // Destroy the data
  afterAll(() => {
    rimrafSync(scriptConfig.contentStore.baseDir)

    return
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

  describe('basic', () => {
    test('.includeReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .includeReferences()
        .find()
        .then((result: any) => {
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
        .queryReferences({'authors.uid': 'a10'})
        .find()
        .then((result: any) => {
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

