/*!
 * Contentstack datasync contentstore filesystem
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
            assets: {
                _content_type_uid: number;
                publish_details: number;
            };
            content_types: {
                _content_type_uid: number;
                publish_details: number;
            };
            entries: {
                _content_type_uid: number;
                publish_details: number;
            };
        };
    };
};
