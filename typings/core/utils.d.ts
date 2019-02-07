export declare const _type: (val: any) => "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
export declare const mergeDeep: (target: any, source: any) => any;
export declare const difference: (obj: any, base: any) => {}[];
export declare const checkCyclic: (uid: any, mapping: any) => boolean;
