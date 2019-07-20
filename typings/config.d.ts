/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
export declare const defaultConfig: {
    contentStore: {
        baseDir: string;
        internal: {
            locale: string;
            types: {
                assets: string;
                content_types: string;
            };
        };
        patterns: {
            assets: string;
            content_types: string;
            entries: string;
        };
        projections: {
            _content_type_uid: number;
            _version: number;
            created_at: number;
            updated_at: number;
        };
        referenceDepth: number;
    };
};
