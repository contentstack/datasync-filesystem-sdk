
[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)

  Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read More](https://www.contentstack.com/).


## Contentstack DataSync Javascript Filesystem SDK

[Contentstack DataSync]([https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync/getting-started](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync/getting-started)) provides Filesystem SDK to query applications that have locally stored contents in filesystem. Given below is the detailed guide and helpful resources to get started with Filesystem SDK.

## Prerequisite

 - nodejs, v6 or higher
 - You should have the data synced through [Contentstack
   DataSync]([https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync/getting-started](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync/getting-started))

  

## Configuration

|Property|DataType|Default|Description|
|--|--|--|--|
|baseDir|string|./_contents|**Required.**  file location of stored data|
|locales|object| |**Required.**  locales to be supported by the SDK. ex: [ { code: 'en-us', ‘relative_url_prefix’:’/’ } ]|

  

  

## Setup and Installation

To import the SDK in your project, use the following command:
```js
const  Contentstack  =  require('@contentstack/datasync-filesystem-sdk').Contentstack
```
  

To initialize the SDK, you'd need to perform the following steps

1.  Initialize stack instance.
    
```js
const  Stack  = contentstack.Stack(config)
```  

2.  Call the connect method. The connect method connects the SDK to the database. Call this, before running SDK queries
    
```js
  Stack.connect(config)
    .then(fnResolve)
    .catch(fnReject)
```
> Important: You need to call this, before running SDK queries!

  
Once you have initialized the SDK, you can start querying on the filesystem

## Querying
- Notes
  - By default, 'content_type_uid' and 'locale' keys as part of the response.
  - If `.language()` is not provided, then the 1st language, provided in `config.locales` would be considered.
  - If querying for a single entry/asset (using `.entry()` OR `.findOne()`), the result will be an object i.e. `{ entry: {} }`, if the entry or asset is not found, `{ entry: null }` will be returned.
  - Querying multiple entries, would return `{ entries: [ {...} ] }`.


1. Query a single entry

```js
  // Sample 1. Returns the 1st entry that matches query filters
  Stack.contentType('blogs')
    .entry() // OR .asset()
    .language('en-us')
    .find()
    .then((result) => {
      // Response
      // result = {
      //   entry: {
      //     title: '' || null
      //   },
      //   content_type_uid: '',
      //   locale: ''
      // }
    })
    .catch(reject)

  // Sample 2. Returns the 1st entry that matches query filters
  Stack.contentType('blogs')
    .entries() // for .assets() 
    .language('en-us')
    .findOne()
    .then((result) => {
      // Response
      // result = {
      //   entry: {
      //     title: '' || null
      //   },
      //   content_type_uid: '',
      //   locale: ''
      // }
    })
    .catch(reject)
```

2. Querying a set of entries, assets or content types
```js
  Stack.contentType('blogs')
    .entries() // for .assets() 
    .includeCount()
    .find()
    .then((result) => {
      // Response
      // result = {
      //   entries: [
      //     {
      //       title: ''
      //     }
      //   ],
      //   content_type_uid: 'blogs',
      //   locale: '',
      //   count: 1
      // }
    })
    .catch(reject)
```

## Advanced Queries

In order to learn more about advance queries please refer the API documentation, [here](https://contentstack.github.io/datasync-filesystem-sdk/).

  
## Further Reading

-   [Getting started with Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync) 
-   [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync/configuration-files-for-contentstack-datasync) doc lists the configuration for different modules
    

## Support and Feature requests

If you have any issues working with the library, please file an issue [here](https://github.com/contentstack/datasync-asset-store-filesystem/issues) at Github.

You can send us an e-mail at [support@contentstack.com](mailto:support@contentstack.com) if you have any support or feature requests. Our support team is available 24/7 on the intercom. You can always get in touch and give us an opportunity to serve you better!

## License

This repository is published under the [MIT license](LICENSE).