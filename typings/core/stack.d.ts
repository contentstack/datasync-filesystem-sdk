/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */
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
    single: boolean;
    constructor(...stack_arguments: any[]);
    connect(overrides?: Object): Promise<{}>;
    contentType(uid: any): Stack;
    entries(): Query & this;
    find(): Promise<{}>;
    findOne(): Promise<{}>;
    entry(uid: any): this & Query;
    asset(uid: any): this & Query;
    assets(): Query & this;
}
