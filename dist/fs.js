"use strict";
/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
const promisifiedReadFile = util_1.promisify(fs_1.readFile);
exports.readFile = (path, type = 'utf-8') => __awaiter(this, void 0, void 0, function* () {
    if (fs_1.existsSync(path)) {
        const contents = yield promisifiedReadFile(path, type);
        return JSON.parse(contents);
    }
    return [];
});
var fs_2 = require("fs");
exports.existsSync = fs_2.existsSync;
