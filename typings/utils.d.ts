/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
export declare const difference: (obj: any, baseObj: any) => unknown;
export declare const getBaseDir: ({ baseDir }: {
    baseDir: any;
}) => {
    contentDir: string;
};
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
interface IContentTypes {
    _assets?: any;
    _content_types?: any;
    [propName: string]: any;
}
export declare const segregateQueries: (queries: any) => {
    aggQueries: IContentTypes;
    contentTypes: any[];
};
export declare const doNothingClause: () => boolean;
export {};
