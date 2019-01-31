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
    single: boolean;
    constructor();
}
