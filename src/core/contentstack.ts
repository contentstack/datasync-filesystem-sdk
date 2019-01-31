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
	 *var Stack = Contentstack.Stack('api_key', 'delivery_token', 'environment');
                 OR
	 *var Stack = Contentstack.Stack({
	 *    'api_key':'stack_api_key',
	 *   'access_token':'stack_delivery_token',
	 *    'environment':'environment_name'
	 * });
	 *
	 * @returns {Stack}
	 */
  public Stack(...stack_argumetnts) {
    return new Stack(...stack_argumetnts)
  }
}

// module.exports = new Contentstack()
