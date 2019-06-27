/*!
 * Contentstack datasync contentstore filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
import { Stack } from './stack';
interface IUserConfig {
    contentStore?: {
        baseDir?: string;
        patterns?: {
            assets?: string;
            content_types?: string;
            entries?: string;
        };
        [propName: string]: any;
    };
    [propName: string]: any;
}
interface IAppConfig extends IUserConfig {
    contentStore?: {
        internal?: {
            locale?: string;
            types?: {
                assets?: string;
                content_types?: string;
            };
        };
        patterns?: {
            assets?: string;
            content_types?: string;
            entries?: string;
        };
    };
}
export declare const setConfig: (userConfig: IUserConfig) => void;
export declare const getConfig: () => IAppConfig;
/**
 *
 * @description Creates an instance of `Contentstack`.
 * @api public
 */
export declare class Contentstack {
    /**
     * @description Initialize an instance of ‘Stack’
     * @api public
     * @example
     * const Stack = Contentstack.Stack('api_key', 'delivery_token')//or
     * const Stack = Contentstack.Stack()
     *
     * @returns {Stack}
     */
    static Stack(stackArguments: any): Stack;
}
export {};
