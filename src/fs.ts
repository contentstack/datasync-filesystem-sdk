/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

import {
  existsSync,
  readFile as rf,
} from 'fs'
import {
  promisify,
} from 'util'

const promisifiedReadFile = promisify(rf)

export const readFile = async (path: string, type: string = 'utf-8') => {
  if (existsSync(path)) {
    const contents: string = await promisifiedReadFile(path, type)

    return JSON.parse(contents)
  }

  return []
}

export {
  existsSync,
} from 'fs'
