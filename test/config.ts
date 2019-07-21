export const config = {
  contentStore: {
    baseDir: './_testing_',
    defaultSortingField: 'updated_at',
    internal: {
      locale: '/locales.json',
      types: {
        assets: '_assets',
        content_types: '_content_types',
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
    referenceDepth: 1,
  },
}
