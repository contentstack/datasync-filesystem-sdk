"use strict";
/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = {
    contentStore: {
        baseDir: './_contents',
        patterns: {
            asset: '/:locale/data/assets/index.json',
            contentType: '/:locale/data/:uid/schema.json',
            entry: '/:locale/data/:content_type_uid/index.json'
        },
        limit: 100
    },
};
