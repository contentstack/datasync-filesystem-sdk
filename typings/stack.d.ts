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
    contentTypeUid: string;
    type: string;
    q: any;
    assetUid: any;
    entryUid: any;
    single: boolean;
    isEntry: boolean;
    constructor(...stackArguments: any[]);
    connect(overrides?: object): Promise<{}>;
    contentType(uid: any): Stack;
    entries(): Query & this;
    find(): Promise<{}>;
    findOne(): Promise<{}>;
    entry(uid?: any): Query & this;
    asset(uid?: any): Query & this;
    assets(): Query & this;
}
