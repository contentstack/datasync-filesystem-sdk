import Debug from 'debug'
import { existsSync, writeFile } from 'fs'
import { cloneDeep } from 'lodash'
import { sync as mkdirSync } from 'mkdirp'
import { join, sep } from 'path'
import { sync as rimrafSync } from 'rimraf'
import { promisify } from 'util'
import { getAssetsPath, getContentTypesPath, getEntriesPath } from '../src/utils'

const writeFileP = promisify(writeFile)

export const init = (Contentstack, config, moduleName: string = 'no-name') => {
  const debug = new Debug(`test:${moduleName}`)
  const scriptConfig = cloneDeep(config)
  scriptConfig.contentStore.baseDir = join(__dirname, moduleName)
  const Stack = Contentstack.Stack(scriptConfig)

  return { debug, scriptConfig, Stack }
}

export const populateAssets = async (scriptConfig, debug, assets) => {
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
}

// tslint:disable-next-line: variable-name
export const populateContentTypes = async (_scriptConfig, debug, content_types) => {
  const contentType = content_types[0]
  const contentTypePath = getContentTypesPath(contentType.locale) + '.json'
  debug(`${contentType._content_type_uid.toUpperCase()}: content type's path is ${contentTypePath}`)
  const folderPath = contentTypePath.slice(0, contentTypePath.lastIndexOf(sep))
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath)
  }

  return writeFileP(contentTypePath, JSON.stringify(content_types))
}

// tslint:disable-next-line: variable-name
export const pupulateEntries = async (_scriptConfig, debug, entries) => {
  const entry = entries[0]
  const entryPath = getEntriesPath(entry.locale, entry._content_type_uid) + '.json'
  debug(`${entry._content_type_uid.toUpperCase()}: entry path is ${entryPath}`)
  const entryFolderPath = entryPath.slice(0, entryPath.lastIndexOf(sep))
  if (!existsSync(entryFolderPath)) {
    mkdirSync(entryFolderPath)
  }

  await writeFileP(entryPath, JSON.stringify(entries))
}

export const destroy = (scriptConfig) => {
  rimrafSync(scriptConfig.contentStore.baseDir)

  return
}
