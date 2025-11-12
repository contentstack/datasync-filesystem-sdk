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
export declare const ERROR_MESSAGES: {
    /**
     * Error when a key does not exist on a data object
     * @param key - The key that was not found
     * @param data - The data object that was searched
     */
    KEY_NOT_FOUND: (key: string, data: any) => string;
    /**
     * Error for invalid parameters in comparison operators
     */
    INVALID_COMPARISON_PARAMS: (type: string) => string;
    /**
     * Error for invalid parameters in contained operators
     */
    INVALID_CONTAINED_PARAMS: (bool: boolean) => string;
    /**
     * Error for invalid parameters in exists operators
     */
    INVALID_EXISTS_PARAMS: (bool: boolean) => string;
    /**
     * Error for invalid parameters in sort methods
     */
    INVALID_SORT_PARAMS: (type: string) => string;
    /**
     * Error when argument should be a number
     */
    ARGUMENT_SHOULD_BE_NUMBER: () => string;
    /**
     * Error when content type uid is not provided
     */
    CONTENT_TYPE_UID_REQUIRED: () => string;
    /**
     * Error when contentType() is not called before entries()
     */
    CONTENT_TYPE_REQUIRED_BEFORE_ENTRIES: () => string;
    /**
     * Error when content type is not found at path
     */
    CONTENT_TYPE_NOT_FOUND: (contentTypeUid: string, filePath: string) => string;
    /**
     * Error for invalid parameters in equalTo()
     */
    INVALID_EQUAL_TO_PARAMS: () => string;
    /**
     * Error for invalid parameters in where()
     */
    INVALID_WHERE_PARAMS: () => string;
    /**
     * Error for invalid parameters in query()
     */
    INVALID_QUERY_PARAMS: () => string;
    /**
     * Error for invalid parameters in tags()
     */
    INVALID_TAGS_PARAMS: () => string;
    /**
     * Error when language code is invalid
     */
    INVALID_LANGUAGE_CODE: (languageCode: any) => string;
    /**
     * Error for invalid parameters in include()
     */
    INVALID_INCLUDE_PARAMS: () => string;
    /**
     * Error for invalid parameters in regex()
     */
    INVALID_REGEX_PARAMS: () => string;
    /**
     * Error for invalid parameters in only()
     */
    INVALID_ONLY_PARAMS: () => string;
    /**
     * Error for invalid parameters in except()
     */
    INVALID_EXCEPT_PARAMS: () => string;
    /**
     * Error for invalid parameters in queryReferences()
     */
    INVALID_QUERY_REFERENCES_PARAMS: () => string;
    /**
     * Error for invalid parameters in referenceDepth()
     */
    INVALID_REFERENCE_DEPTH_PARAMS: () => string;
};
export declare const WARNING_MESSAGES: {
    /**
     * Warning for slow .includeReferences() query
     */
    INCLUDE_REFERENCES_SLOW: () => string;
    /**
     * Warning when increasing reference depth beyond default
     */
    REFERENCE_DEPTH_PERFORMANCE: (referenceDepth: number) => string;
};
