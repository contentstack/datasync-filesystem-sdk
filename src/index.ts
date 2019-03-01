/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

import {  Stack } from './stack'
/**
 * @method Contentstack
 * @description Creates an instance of `Contentstack`.
 * @api public
 */

export class Contentstack {
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
  public static Stack(...stackArguments) {
    return new Stack(...stackArguments)
  }
}


