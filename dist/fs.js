"use strict";
/*!
 * Contentstack DataSync Filesystem SDK.
 * Enables querying on contents saved via @contentstack/datasync-content-store-filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.existsSync = exports.readFile = void 0;
const fs_1 = require("fs");
const util_1 = require("util");
const promisifiedReadFile = (0, util_1.promisify)(fs_1.readFile);
const readFile = (path, type = 'utf-8') => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, fs_1.existsSync)(path)) {
        const contents = yield promisifiedReadFile(path, type);
        return JSON.parse(contents);
    }
    return [];
});
exports.readFile = readFile;
var fs_2 = require("fs");
Object.defineProperty(exports, "existsSync", { enumerable: true, get: function () { return fs_2.existsSync; } });
