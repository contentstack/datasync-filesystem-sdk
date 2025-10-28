/*!
 * Contentstack DataSync Filesystem SDK.
 * Centralized error and warning messages
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

/**
 * Centralized error and warning messages for the SDK
 * This file contains all user-facing messages to ensure consistency and ease of maintenance
 */
export const ERROR_MESSAGES = {
  /**
   * Error when a key does not exist on a data object
   * @param key - The key that was not found
   * @param data - The data object that was searched
   */
  KEY_NOT_FOUND: (key: string, data: any) => 
    `The key '${key}' does not exist on: ${JSON.stringify(data)}`,

  /**
   * Error for invalid parameters in comparison operators
   */
  INVALID_COMPARISON_PARAMS: (type: string) => 
    `Kindly provide valid parameters for ${type}`,

  /**
   * Error for invalid parameters in contained operators
   */
  INVALID_CONTAINED_PARAMS: (bool: boolean) => 
    `Kindly provide valid parameters for ${bool}`,

  /**
   * Error for invalid parameters in exists operators
   */
  INVALID_EXISTS_PARAMS: (bool: boolean) => 
    `Kindly provide valid parameters for ${bool}`,

  /**
   * Error for invalid parameters in sort methods
   */
  INVALID_SORT_PARAMS: (type: string) => 
    `Kindly provide valid parameters for sort-${type}`,

  /**
   * Error when argument should be a number
   */
  ARGUMENT_SHOULD_BE_NUMBER: () => 
    'Argument should be a number.',

  /**
   * Error when content type uid is not provided
   */
  CONTENT_TYPE_UID_REQUIRED: () => 
    'Kindly provide a uid for .contentType()',

  /**
   * Error when contentType() is not called before entries()
   */
  CONTENT_TYPE_REQUIRED_BEFORE_ENTRIES: () => 
    'Please call .contentType() before calling .entries()!',

  /**
   * Error when content type is not found at path
   */
  CONTENT_TYPE_NOT_FOUND: (contentTypeUid: string, filePath: string) => 
    `Queried content type ${contentTypeUid} was not found at ${filePath}!`,

  /**
   * Error for invalid parameters in equalTo()
   */
  INVALID_EQUAL_TO_PARAMS: () => 
    'Kindly provide valid parameters for .equalTo()!',

  /**
   * Error for invalid parameters in where()
   */
  INVALID_WHERE_PARAMS: () => 
    'Kindly provide a valid field and expr/fn value for \'.where()\'',

  /**
   * Error for invalid parameters in query()
   */
  INVALID_QUERY_PARAMS: () => 
    'Kindly provide valid parameters for \'.query()\'',

  /**
   * Error for invalid parameters in tags()
   */
  INVALID_TAGS_PARAMS: () => 
    'Kindly provide valid parameters for \'.tags()\'',

  /**
   * Error when language code is invalid
   */
  INVALID_LANGUAGE_CODE: (languageCode: any) => 
    `${languageCode} should be of type string and non-empty!`,

  /**
   * Error for invalid parameters in include()
   */
  INVALID_INCLUDE_PARAMS: () => 
    'Kindly pass \'string\' OR \'array\' fields for .include()!',

  /**
   * Error for invalid parameters in regex()
   */
  INVALID_REGEX_PARAMS: () => 
    'Kindly provide valid parameters for .regex()!',

  /**
   * Error for invalid parameters in only()
   */
  INVALID_ONLY_PARAMS: () => 
    'Kindly provide valid parameters for .only()!',

  /**
   * Error for invalid parameters in except()
   */
  INVALID_EXCEPT_PARAMS: () => 
    'Kindly provide valid parameters for .except()!',

  /**
   * Error for invalid parameters in queryReferences()
   */
  INVALID_QUERY_REFERENCES_PARAMS: () => 
    'Kindly valid parameters for \'.queryReferences()\'!',

  /**
   * Error for invalid parameters in referenceDepth()
   */
  INVALID_REFERENCE_DEPTH_PARAMS: () => 
    'Kindly valid parameters for \'.referenceDepth()\'!',
}

export const WARNING_MESSAGES = {
  /**
   * Warning for slow .includeReferences() query
   */
  INCLUDE_REFERENCES_SLOW: () => 
    '.includeReferences(...)',

  /**
   * Warning when increasing reference depth beyond default
   */
  REFERENCE_DEPTH_PERFORMANCE: (referenceDepth: number) => 
    `Increasing reference depth beyond ${referenceDepth} may impact performance.`,
}

