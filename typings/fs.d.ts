/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
/// <reference types="node" />
export declare const readFile: (path: string, encoding?: BufferEncoding) => Promise<any>;
export { existsSync, } from 'fs';
