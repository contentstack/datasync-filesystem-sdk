export declare class Query {
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
    baseDir: any;
    masterLocale: any;
    content_type_uid: any;
    private _query;
    type: string;
    constructor();
    includeReferences(): this;
    equalTo(key: any, value: any): void | this;
    where(key: any, value: any): void | this;
    count(): this;
    query(query: any): void | this;
    tags(values: any): void | this;
    includeCount(): this;
    language(language_code: any): void | this;
    includeContentType(): this;
    addParam(key: any, value: any): void | this;
    getQuery(): any;
    regex(key: any, value: any, options: any): void | this;
    only(fields: any): this;
    except(fields: any): this;
    isEmpty(obj: any): boolean;
    find(): Promise<{}>;
    findOne(): Promise<{}>;
    private findReferences;
    private includeReferencesI;
}
