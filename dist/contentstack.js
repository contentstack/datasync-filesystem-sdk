"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stack_1 = require("./stack");
class Contentstack {
    static Stack(...stackArguments) {
        return new stack_1.Stack(...stackArguments);
    }
}
exports.Contentstack = Contentstack;
