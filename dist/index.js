"use strict";
/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contentstack = exports.getConfig = exports.setConfig = void 0;
const lodash_1 = require("lodash");
const config_1 = require("./config");
const stack_1 = require("./stack");
let config = config_1.defaultConfig;
const setConfig = (userConfig) => {
    config = (0, lodash_1.merge)(config, userConfig);
};
exports.setConfig = setConfig;
const getConfig = () => {
    return config;
};
exports.getConfig = getConfig;
/**
 * @public
 * @class Contentstack
 * @description Creates an instance of `Contentstack`.
 */
class Contentstack {
    /**
     * @description Initialize an instance of ‘Stack’
     * @api public
     * @example
     * const Stack = Contentstack.Stack('api_key', 'delivery_token')//or
     * const Stack = Contentstack.Stack()
     *
     * @returns {Stack}
     */
    static Stack(stackArguments) {
        config = (0, lodash_1.merge)(config, stackArguments);
        return new stack_1.Stack(config);
    }
}
exports.Contentstack = Contentstack;
