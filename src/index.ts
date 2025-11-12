/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

import { merge } from 'lodash'
import { defaultConfig } from './config'
import { Stack } from './stack'
export { ERROR_MESSAGES, WARNING_MESSAGES } from './messages'

interface IUserConfig {
  contentStore?: {
    baseDir?: string,
    patterns?: {
      assets?: string,
      content_types?: string,
      entries?: string,
    },
    [propName: string]: any,
  },
  [propName: string]: any
}

interface IAppConfig extends IUserConfig {
  contentStore: {
    baseDir: string,
    internal?: {
      locale?: string,
      types?: {
        assets?: string,
        content_types?: string,
      },
    },
    patterns?: {
      assets?: string,
      content_types?: string,
      entries?: string,
    },
  }
}

let config: IAppConfig = defaultConfig

export const setConfig = (userConfig: IUserConfig) => {
  config = merge(config, userConfig)
}

export const getConfig = (): IAppConfig => {
  return config
}

/**
 * @public
 * @class Contentstack
 * @description Creates an instance of `Contentstack`.
 */
export class Contentstack {
  /**
   * @description Initialize an instance of ‘Stack’
   * @api public
   * @example
   * const Stack = Contentstack.Stack('api_key', 'delivery_token')//or
   * const Stack = Contentstack.Stack()
   *
   * @returns {Stack}
   */
  public static Stack(stackArguments) {
    config = merge(config, stackArguments)

    return new Stack(config)
  }
}
