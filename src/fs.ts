/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

import { existsSync, readFileSync } from "fs";

export const readFile = async (
  path: string,
  encoding: BufferEncoding = "utf-8"
) => {
  if (existsSync(path)) {
    const contents: string = readFileSync(path, { encoding });

    return JSON.parse(contents);
  }

  return [];
};

export {
  existsSync,
} from 'fs'
