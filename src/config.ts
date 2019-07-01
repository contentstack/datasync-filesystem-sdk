/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

export const defaultConfig = {
  contentStore: {
    baseDir: './_contents',
    internal: {
      locale: '/locales.json',
      types: {
        assets: '_assets',
        content_types: '_content_types',
      },
    },
    patterns: {
      assets: '/:locale/data/assets',
      content_types: '/:locale/data/content_types',
      entries: '/:locale/data/:_content_type_uid',
    },
    projections: {
      assets: {
        _content_type_uid: 0,
        publish_details: 0,
      },
      content_types: {
        _content_type_uid: 0,
        publish_details: 0,
      },
      entries: {
        _content_type_uid: 0,
        publish_details: 0,
      },
    },
  },
}
