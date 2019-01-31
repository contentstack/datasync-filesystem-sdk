import { Query } from './query';
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
    constructor(...stack_arguments: any[]);
    connect(): Promise<{}>;
    contentType(uid: any): this;
    entries(...val: any[]): this & Query;
    find(): Promise<{}>;
    entry(uid: any): this & Query;
    asset(uid: any): this & Query;
    assets(): this & Query;
}
