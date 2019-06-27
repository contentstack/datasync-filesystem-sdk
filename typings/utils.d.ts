/*!
 * Contentstack datasync contentstore filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
export declare const difference: (obj: any, baseObj: any) => unknown[];
/**
 * @public
 * @method getEntriesPath
 * @param contentTypeUid Content type - uid, who's entries are to be fetched
 * @param locale Locale from which the contents have to be read
 */
export declare const getEntriesPath: (locale: any, contentTypeUid: any) => any;
/**
 * @public
 * @method getAssetsPath
 * @param locale Locale from which the contents have to be read
 */
export declare const getAssetsPath: (locale: any) => any;
/**
 * @public
 * @method getContentTypesPath
 * @param locale Locale from which the contents have to be read
 */
export declare const getContentTypesPath: (locale: any) => any;
