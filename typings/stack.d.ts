/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */
export declare class Stack {
    baseDir: any;
    masterLocale: any;
    config: any;
    contentTypeUid: string;
    type: string;
    q: any;
    assetUid: any;
    entryUid: any;
    lessThan: (key: any, value: any) => any;
    lessThanOrEqualTo: (key: any, value: any) => any;
    greaterThan: (key: any, value: any) => any;
    greaterThanOrEqualTo: (key: any, value: any) => any;
    notEqualTo: (key: any, value: any) => any;
    containedIn: (key: any, value: any) => any;
    notContainedIn: (key: any, value: any) => any;
    exists: (key: any) => any;
    notExists: (key: any) => any;
    ascending: (key: any) => any;
    descending: (key: any) => any;
    skip: (value: any) => any;
    limit: (value: any) => any;
    or: () => any;
    nor: () => any;
    not: () => any;
    and: () => any;
    constructor(...stackArguments: any[]);
    connect(overrides?: object): Promise<{}>;
    contentType(uid: any): Stack;
    entries(): this;
    entry(uid?: any): this;
    asset(uid?: any): Stack;
    assets(): Stack;
    equalTo(key: any, value: any): this;
    where(expr: any): this;
    count(): this;
    query(userQuery: any): this;
    tags(values: any): this;
    includeCount(): this;
    language(languageCode: any): this;
    includeReferences(): this;
    excludeReferences(): this;
    includeContentType(): this;
    getQuery(): any;
    regex(key: any, value: any, options?: string): this;
    only(fields: any): this;
    except(fields: any): this;
    queryReferences(query: any): this;
    find(): Promise<{}>;
    findOne(): Promise<{}>;
    private queryOnReferences;
    private findReferences;
    private includeReferencesI;
    private preProcess;
    private postProcessResult;
}
