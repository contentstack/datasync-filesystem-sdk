export const config = {
  contentStore: {
    baseDir: './_testing_',
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
    // TODO
    // Eval if this is slowing down the response
    projections: {
      _content_type_uid: 0,
      _version: 0,
      created_at: 0,
      updated_at: 0,
    },
    referenceDepth: 1,
  },
  locales: [
    {
      code: 'en-us',
      relative_url_prefix: '/',
    },
    {
      code: 'es-es',
      relative_url_prefix: '/es/',
    },
  ],
}
