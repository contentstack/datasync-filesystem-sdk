"use strict";
/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const stack_1 = require("./stack");
/**
 * @method Contentstack
 * @description Creates an instance of `Contentstack`.
 * @api public
 */
class Contentstack {
    /**
     * @method Stack
     * @description Initialize an instance of ‘Stack’
     * @api public
     * @example
     * const Stack = Contentstack.Stack('api_key', 'delivery_token')//or
     * const Stack = Contentstack.Stack({
     *  api_key: 'api_key',
     *  token: 'delivery_token'
     * })
     *
     * @returns {Stack}
     */
    static Stack(...stackArguments) {
        return new stack_1.Stack(...stackArguments);
    }
}
exports.Contentstack = Contentstack;
