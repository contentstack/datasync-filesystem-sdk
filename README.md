[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)

Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read More](https://www.contentstack.com/).

## Contentstack DataSync Filesystem SDK

[Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync) provides Filesystem SDK to query applications that have locally stored contents in filesystem. Given below is the detailed guide and helpful resources to get started with Filesystem SDK.

### Prerequisite

- Nodejs, v20 or higher
- You should have the data synced through [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync)

### Configuration

|Property|Type|Defaults|Description|
|--|--|--|--|
|baseDir|string|./_contents|**Optional** Base directory of the folder where data is stored.|
|locale|string|'en-us'|**Optional** Default locale that'd be considered, if the .language() isn't specified in queries|
|referenceDepth|number|2|**Optional** The default nested-reference-field depth that'd be considered when calling .includeReferences(). This can be overridden by passing a numerical argument to .includeReferences(4)|
|projections|object|{_content_type_uid: 0}|**Optional** Keys that by default would be removed from results. Pass `key: 0` to remove, `key: 1` to override the existing..|

### Environment Variables

The SDK supports the following environment variables for advanced configuration:

| Variable    | Description | Default |
|-------------|-------------|-------------| 
| `APP_ROOT`  | (Optional) Sets the root directory for content storage. | current working directory |

### Config Overview

Here's an overview of the SDK's configurable properties

```ts
{
  contentStore: {
    baseDir: './_contents',
    defaultSortingField: 'updated_at',
    locale: 'en-us',
    projections: {
      _content_type_uid: 0,
    },
    referenceDepth: 2,
  },
}
```

### Sample SDK Query

Here's a sample SDK query to get started. Learn more on how to query using datasync-filesystem-sdk [here](https://contentstack.github.io/datasync-filesystem-sdk/).

```ts
import { Contentstack } from 'datasync-filesystem-sdk'
const Stack = Contentstack.Stack(config)

Stack.connect()
  .then(() => {
    return Stack.contentType('blog')
      .entries()
      .language('en-gb') // Optional. If not provided, defaults to en-us
      .include(['authors'])
      .includeCount()
      .includeContentType()
      .queryReferences({'authors.firstName': 'R.R. Martin'})
      .then((result) => {
        // Your result would be
        // {
        //   entries: [...], // All entries, who's first name is R.R. Martin
        //   content_type_uid: 'blog',
        //   locale: 'es-es',
        //   content_type: {...}, // Blog content type's schema
        //   count: 3, // Total count of blog content type
        // }
      })
  })
  .catch((error) => {
    // handle errors..
  })
```
> Important: You need to call .connect(), to initiate SDK queries!

Once you have initialized the SDK, you can start querying on the filesystem

### Querying
- Notes
  - By default, 'content_type_uid' and 'locale' keys as part of the response.
  - If `.language()` is not provided, then the 1st language, provided in `config.defaultLocale` would be considered.
  - If querying for a single entry/asset (using `.entry()` OR `.findOne()`), the result will be an object i.e. `{ entry: {} }`, if the entry or asset is not found, `{ entry: null }` will be returned.
  - Querying multiple entries, would return `{ entries: [ {...} ] }`.
  - By default, all entry responses would include their referred assets. If `.excludeReferences()` is called, no references (including assets) would **not** be returned in the response.

- Query a single entry
```ts
// Sample 1. Returns the 1st entry that matches query filters
Stack.contentType('blog')
  .entry() // OR .asset()
  .find()
  .then((result) => {
    // Response
    // result = {
    //   entry: any | null,
    //   content_type_uid: string,
    //   locale: string,
    // }
  })
  .catch(reject)

// Sample 2. Returns the 1st entry that matches query filters
Stack.contentType('blogs')
  .entries() // for .assets() 
  .findOne()
  .then((result) => {
    // Response
    // result = {
    //   entry: any | null,
    //   content_type_uid: string,
    //   locale: string,
    // }
  })
  .catch(reject)
```

- Querying a set of entries, assets or content types
```ts
Stack.contentType('blog')
  .entries() // for .assets() 
  .includeCount()
  .find()
  .then((result) => {
    // Response
    // result = {
    //   entry: any | null,
    //   content_type_uid: string,
    //   count: number,
    //   locale: string,
    // }
  })
  .catch(reject)
```

## Advanced Queries

In order to learn more about advance queries please refer the API documentation, [here](https://contentstack.github.io/datasync-filesystem-sdk/).
  
## Further Reading
- [Getting started with Contentstack DataSync](https://www.contentstack.com/docs/developers/develop-apps-with-datasync/get-started-with-contentstack-datasync) 
- [Contentstack DataSync](https://www.contentstack.com/docs/developers/develop-apps-with-datasync/configuration-files-for-contentstack-datasync) doc lists the configuration for different modules

## Support and Feature requests

If you have any issues working with the library, please file an issue [here](https://github.com/contentstack/datasync-filesystem-sdk/issues) at Github.

You can send us an e-mail at [support@contentstack.com](mailto:support@contentstack.com) if you have any support or feature requests.

Our support team is available 24/7 on the intercom. You can always get in touch and give us an opportunity to serve you better!

## License

This repository is published under the [MIT license](./LICENSE).
