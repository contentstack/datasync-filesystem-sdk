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
scriptConfig.contentStore.baseDir = join(__dirname, '_testing_count')
const Stack = Contentstack.Stack(scriptConfig)
const blogCount = blogs.length

describe('# Count', () => {
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

  describe('basic', () => {
    test('.count()', () => {
      return Stack.contentType('blog')
        .entries()
        .count()
        .then((result: any) => {
          expect(result).toHaveProperty('count')
          expect(result).toHaveProperty('locale')
          expect(result.count).toEqual(blogCount)
          expect(Object.keys(result)).toHaveLength(2)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })

  describe('querying', () => {
    test('.count() + .queryReferences()', () => {
      return Stack.contentType('blog')
        .entries()
        .queryReferences({'authors.uid': 'a10'})
        .count()
        .then((result: any) => {
          expect(result).toHaveProperty('count')
          expect(result).toHaveProperty('locale')
          expect(result.count).toEqual(1)
          expect(Object.keys(result)).toHaveLength(2)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

