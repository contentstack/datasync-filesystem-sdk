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
scriptConfig.contentStore.baseDir = join(__dirname, '_testing_logical_operators')
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

describe('# Logical Operator Querying', () => {
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

  describe('on: non pre-existing operator', () => {
    test('.and()', () => {
      return Stack.contentType('blog')
        .entries()
        .and([{_content_type_uid: 'blog'}, {no: 1}])
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(1)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.or()', () => {
      return Stack.contentType('blog')
        .entries()
        .or([{_content_type_uid: 'blogs'}, {no: 1}])
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(1)
          result.entries.forEach((entry) => {
            expect(entry).toHaveProperty('no')
            expect(entry.no).toEqual(1)
          })
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

  })

  describe('on: pre-existing operator', () => {
    test('.and()', () => {
      return Stack.contentType('blog')
        .entries()
        .and([{no: 1}])
        .and([{_content_type_uid: 'blogs'}])
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(0)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })

    test('.or()', () => {
      return Stack.contentType('blog')
        .entries()
        .or([{no: 1}])
        .or([{_content_type_uid: 'blogs'}])
        .find()
        .then((result: any) => {
          checkEntries(result)
          expect(result.content_type_uid).toEqual('blog')
          expect(result.entries).toHaveLength(0)
        }).catch((error) => {
          expect(error).toBeNull()
        })
    })
  })
})

