export declare class Stack {
    baseDir: any;
    masterLocale: any;
    config: any;
    content_type_uid: string;
    type: string;
    _query: any;
    asset_uid: any;
    entry_uid: any;
    _entry: string;
    constructor(...stack_arguments: {});
    connect(): any;
    contentType(uid: any): this;
    entries(...val: {}): any;
    find(): any;
    entry(uid: any): any;
    asset(uid: any): any;
    assets(): any;
    query(): any;
}
