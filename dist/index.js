"use strict";
/*!
 * Contentstack datasync contentstore filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const config_1 = require("./config");
const stack_1 = require("./stack");
let config = config_1.defaultConfig;
exports.setConfig = (userConfig) => {
    config = lodash_1.merge(config, userConfig);
};
exports.getConfig = () => {
    return config;
};
/**
 *
 * @description Creates an instance of `Contentstack`.
 * @api public
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
        config = lodash_1.merge(config, stackArguments);
        return new stack_1.Stack(config);
    }
}
exports.Contentstack = Contentstack;
