"use strict";
/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
exports.defaultConfig = {
    contentStore: {
        baseDir: './_contents',
        defaultSortingField: 'updated_at',
        internal: {
            locale: '/locales.json',
            types: {
                assets: '_assets',
                content_types: '_content_types',
                references: '_references',
            },
        },
        locale: 'en-us',
        patterns: {
            assets: '/:locale/data/assets',
            content_types: '/:locale/data/content_types',
            entries: '/:locale/data/:_content_type_uid',
        },
        // TODO
        // Eval if this is slowing down the response
        projections: {
            _content_type_uid: 0,
        },
        referenceDepth: 2,
    },
};
