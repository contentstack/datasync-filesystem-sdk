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

export const readFile = async (path: string) => {
  if (existsSync(path)) {
    const contents: Buffer = await promisifiedReadFile(path)

    return JSON.parse(contents.toString())
  }

  return []
}

export {
  existsSync,
} from 'fs'
