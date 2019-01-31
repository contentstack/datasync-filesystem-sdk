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
   * @returns {Stack}
   */
  public Stack(...stack_argumetnts) {
    return new Stack(...stack_argumetnts)
  }
}


