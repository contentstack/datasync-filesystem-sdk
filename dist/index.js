"use strict";
/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var stack_1 = require("./stack");

var Contentstack = function () {
    function Contentstack() {
        _classCallCheck(this, Contentstack);
    }

    _createClass(Contentstack, null, [{
        key: "Stack",
        value: function Stack() {
            for (var _len = arguments.length, stackArguments = Array(_len), _key = 0; _key < _len; _key++) {
                stackArguments[_key] = arguments[_key];
            }

            return new (Function.prototype.bind.apply(stack_1.Stack, [null].concat(stackArguments)))();
        }
    }]);

    return Contentstack;
}();

exports.Contentstack = Contentstack;