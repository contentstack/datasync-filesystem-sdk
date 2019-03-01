"use strict";
/*!
 * contentstack-sync-filsystem-sdk
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var json_mask_1 = __importDefault(require("json-mask"));
var lodash_1 = require("lodash");
var path_1 = __importDefault(require("path"));
var sift_1 = __importDefault(require("sift"));
var util_1 = require("util");
var default_1 = require("./default");
var utils_1 = require("./utils");
var readFile = util_1.promisify(fs_1.default.readFile);
var extend = {
    compare: function compare(type) {
        return function (key, value) {
            if (key && value && typeof key === 'string' && typeof value !== 'undefined') {
                this.q.query = this.q.query || {};
                this.q.query[key] = this.q.query.file_size || {};
                this.q.query[key][type] = value;
                return this;
            }
            throw new Error('Kindly provide valid parameters.');
        };
    },
    contained: function contained(bool) {
        var type = bool ? '$in' : '$nin';
        return function (key, value) {
            if (key && value && typeof key === 'string' && Array.isArray(value)) {
                this.q.query = this.q.query || {};
                this.q.query[key] = this.q.query[key] || {};
                this.q.query[key][type] = this.q.query[key][type] || [];
                this.q.query[key][type] = this.q.query[key][type].concat(value);
                return this;
            }
            throw new Error('Kindly provide valid parameters.');
        };
    },
    exists: function exists(bool) {
        return function (key) {
            if (key && typeof key === 'string') {
                this.q.query = this.q.query || {};
                this.q.query[key] = this.q.query[key] || {};
                this.q.query[key].$exists = bool;
                return this;
            }
            throw new Error('Kindly provide valid parameters.');
        };
    },
    logical: function logical(type) {
        return function () {
            this.q.logical = this.q.logical || {};
            this.q.logical[type] = this.q.logical[type] || {};
            this.q.logical[type] = this.q.query;
            delete this.q.query;
            return this;
        };
    },
    sort: function sort(type) {
        return function (key) {
            if (key && typeof key === 'string') {
                this.q[type] = key;
                return this;
            }
            throw new Error('Argument should be a string.');
        };
    },
    pagination: function pagination(type) {
        return function (value) {
            if (typeof value === 'number') {
                this.q[type] = value;
                return this;
            }
            throw new Error('Argument should be a number.');
        };
    }
};

var Stack = function () {
    function Stack() {
        _classCallCheck(this, Stack);

        this.q = {};

        for (var _len = arguments.length, stackArguments = Array(_len), _key = 0; _key < _len; _key++) {
            stackArguments[_key] = arguments[_key];
        }

        this.config = lodash_1.merge.apply(lodash_1, [default_1.defaultConfig].concat(stackArguments));
        this.q = this.q || {};
        this.q.query = this.q.query || {};
        this.lessThan = extend.compare('$lt');
        this.lessThanOrEqualTo = extend.compare('$lte');
        this.greaterThan = extend.compare('$gt');
        this.greaterThanOrEqualTo = extend.compare('$gte');
        this.notEqualTo = extend.compare('$ne');
        this.containedIn = extend.contained(true);
        this.notContainedIn = extend.contained(false);
        this.exists = extend.exists(true);
        this.notExists = extend.exists(false);
        this.ascending = extend.sort('asc');
        this.descending = extend.sort('desc');
        this.skip = extend.pagination('skip');
        this.limit = extend.pagination('limit');
        this.or = extend.logical('$or');
        this.nor = extend.logical('$nor');
        this.not = extend.logical('$not');
        this.and = extend.logical('$and');
    }

    _createClass(Stack, [{
        key: "connect",
        value: function connect() {
            var _this = this;

            var overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this.config = lodash_1.merge(this.config, overrides);
            return new Promise(function (resolve, reject) {
                try {
                    _this.baseDir = process.env.CONTENT_DIR ? path_1.default.resolve(process.env.CONTENT_DIR) : fs_1.default.existsSync(path_1.default.resolve(path_1.default.join(__dirname, '../../../', _this.config.contentStore.baseDir))) ? path_1.default.resolve(path_1.default.join(__dirname, '../../../', _this.config.contentStore.baseDir)) : path_1.default.resolve(path_1.default.join(process.cwd(), '_contents'));
                    if (typeof _this.baseDir !== 'string' || !fs_1.default.existsSync(_this.baseDir)) {
                        throw new Error('Could not resolve ' + _this.baseDir);
                    }
                    if (!_this.config.hasOwnProperty('locales') || !Array.isArray(_this.config.locales) || _this.config.locales.length === 0) {
                        throw new Error('Please provide locales with code and relative_url_prefix.');
                    }
                    _this.masterLocale = _this.config.locales[0].code;
                    return resolve(_this.baseDir);
                } catch (error) {
                    reject(error);
                }
            });
        }
    }, {
        key: "contentType",
        value: function contentType(uid) {
            var stack = new Stack(this.config);
            stack.baseDir = this.baseDir;
            stack.masterLocale = this.masterLocale;
            if (!uid) {
                throw new Error('Please provide valid uid');
            } else if (uid && typeof uid === 'string') {
                stack.contentTypeUid = uid;
                stack.type = 'contentType';
            }
            return stack;
        }
    }, {
        key: "entries",
        value: function entries() {
            this.q.isEntry = true;
            if (this.type === undefined) {
                throw new Error('Please call contentType(\'uid\') first');
            }
            return this;
        }
    }, {
        key: "entry",
        value: function entry(uid) {
            this.q.isEntry = true;
            this.q.single = true;
            if (this.type === undefined) {
                throw new Error('Please call contentType(\'uid\') first');
            }
            if (uid && typeof uid === 'string') {
                this.entryUid = uid;
                return this;
            }
            return this;
        }
    }, {
        key: "asset",
        value: function asset(uid) {
            var stack = new Stack(this.config);
            stack.baseDir = this.baseDir;
            stack.masterLocale = this.masterLocale;
            stack.type = 'asset';
            stack.q.single = true;
            if (uid && typeof uid === 'string') {
                stack.assetUid = uid;
                return stack;
            }
            return stack;
        }
    }, {
        key: "assets",
        value: function assets() {
            var stack = new Stack(this.config);
            stack.baseDir = this.baseDir;
            stack.masterLocale = this.masterLocale;
            stack.type = 'asset';
            return stack;
        }
    }, {
        key: "equalTo",
        value: function equalTo(key, value) {
            if (key && typeof key === 'string') {
                this.q.query[key] = value;
                return this;
            }
            throw new Error('Kindly provide valid parameters.');
        }
    }, {
        key: "where",
        value: function where(expr) {
            if (expr) {
                this.q.query.$where = expr;
                return this;
            }
            throw new Error('Kindly provide a valid field and expr/fn value for \'.where()\'');
        }
    }, {
        key: "count",
        value: function count() {
            this.q.count = true;
            return this;
        }
    }, {
        key: "query",
        value: function query(userQuery) {
            if ((typeof userQuery === "undefined" ? "undefined" : _typeof(userQuery)) === 'object') {
                this.q.query = lodash_1.merge(this.q.query, userQuery);
                return this;
            }
            throw new Error('Kindly provide valid parameters');
        }
    }, {
        key: "tags",
        value: function tags(values) {
            if (Array.isArray(values)) {
                this.q.tags = values;
                return this;
            }
            throw new Error('Kindly provide valid parameters');
        }
    }, {
        key: "includeCount",
        value: function includeCount() {
            this.q.include_count = true;
            return this;
        }
    }, {
        key: "language",
        value: function language(languageCode) {
            if (languageCode && typeof languageCode === 'string') {
                this.q.locale = languageCode;
                return this;
            }
            throw new Error('Argument should be a String.');
        }
    }, {
        key: "includeReferences",
        value: function includeReferences() {
            this.q.includeReferences = true;
            return this;
        }
    }, {
        key: "excludeReferences",
        value: function excludeReferences() {
            this.q.excludeReferences = true;
            return this;
        }
    }, {
        key: "includeContentType",
        value: function includeContentType() {
            this.q.include_content_type = true;
            return this;
        }
    }, {
        key: "getQuery",
        value: function getQuery() {
            return this.q.query;
        }
    }, {
        key: "regex",
        value: function regex(key, value) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'g';

            if (key && value && typeof key === 'string' && typeof value === 'string') {
                this.q.query[key] = {
                    $options: options,
                    $regex: value
                };
                return this;
            }
            throw new Error('Kindly provide valid parameters.');
        }
    }, {
        key: "only",
        value: function only(fields) {
            if (!fields || (typeof fields === "undefined" ? "undefined" : _typeof(fields)) !== 'object' || !(fields instanceof Array) || fields.length === 0) {
                throw new Error('Kindly provide valid \'field\' values for \'only()\'');
            }
            this.q.only = this.q.only || {};
            this.q.only = fields;
            return this;
        }
    }, {
        key: "except",
        value: function except(fields) {
            if (!fields || (typeof fields === "undefined" ? "undefined" : _typeof(fields)) !== 'object' || !(fields instanceof Array) || fields.length === 0) {
                throw new Error('Kindly provide valid \'field\' values for \'except()\'');
            }
            this.q.except = this.q.except || {};
            this.q.except = fields;
            return this;
        }
    }, {
        key: "queryReferences",
        value: function queryReferences(query) {
            if (query && (typeof query === "undefined" ? "undefined" : _typeof(query)) === 'object') {
                this.q.queryReferences = query;
                return this;
            }
            throw new Error('Kindly pass a query object for \'.queryReferences()\'');
        }
    }, {
        key: "find",
        value: function find() {
            var _this2 = this;

            var baseDir = this.baseDir;
            var masterLocale = this.masterLocale;
            var contentTypeUid = this.contentTypeUid;
            var locale = !this.q.locale ? masterLocale : this.q.locale;
            return new Promise(function (resolve, reject) {
                try {
                    var dataPath = void 0;
                    var schemaPath = void 0;
                    if (_this2.type === 'asset') {
                        dataPath = path_1.default.join(baseDir, locale, 'assets', '_assets.json');
                    } else {
                        dataPath = path_1.default.join(baseDir, locale, 'data', contentTypeUid, 'index.json');
                        schemaPath = path_1.default.join(baseDir, locale, 'data', contentTypeUid, '_schema.json');
                    }
                    if (!fs_1.default.existsSync(dataPath)) {
                        return reject('content-type or entry not found');
                    }
                    fs_1.default.readFile(dataPath, 'utf8', function (err, data) {
                        return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                            var _this3 = this;

                            var finalResult, type, filteredData, uid, preProcessedData;
                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                while (1) {
                                    switch (_context2.prev = _context2.next) {
                                        case 0:
                                            if (!err) {
                                                _context2.next = 2;
                                                break;
                                            }

                                            return _context2.abrupt("return", reject(err));

                                        case 2:
                                            finalResult = {
                                                content_type_uid: this.contentTypeUid || '_assets',
                                                locale: locale
                                            };
                                            type = this.type !== 'asset' ? 'entries' : 'assets';

                                            if (!(data === undefined || data === '')) {
                                                _context2.next = 13;
                                                break;
                                            }

                                            if (!this.q.single) {
                                                _context2.next = 10;
                                                break;
                                            }

                                            type = type === 'entries' ? 'entry' : 'asset';
                                            finalResult[type] = {};
                                            this.q = {};
                                            return _context2.abrupt("return", resolve(finalResult));

                                        case 10:
                                            finalResult[type] = [];
                                            this.q = {};
                                            return _context2.abrupt("return", resolve(finalResult));

                                        case 13:
                                            data = JSON.parse(data);
                                            filteredData = lodash_1.map(data, 'data');

                                            if (this.assetUid || this.entryUid) {
                                                uid = this.assetUid || this.entryUid;

                                                filteredData = lodash_1.find(filteredData, ['uid', uid]);
                                            }

                                            if (!this.q.queryReferences) {
                                                _context2.next = 18;
                                                break;
                                            }

                                            return _context2.abrupt("return", this.queryOnReferences(filteredData, finalResult, locale, type, schemaPath).then(resolve).catch(reject));

                                        case 18:
                                            if (!this.q.excludeReferences) {
                                                _context2.next = 23;
                                                break;
                                            }

                                            preProcessedData = this.preProcess(filteredData);

                                            this.postProcessResult(finalResult, preProcessedData, type, schemaPath).then(function (result) {
                                                _this3.q = {};
                                                return resolve(result);
                                            }).catch(reject);
                                            _context2.next = 24;
                                            break;

                                        case 23:
                                            return _context2.abrupt("return", this.includeReferencesI(filteredData, locale, {}, undefined).then(function () {
                                                return __awaiter(_this3, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                                                    var _this4 = this;

                                                    var preProcessedData;
                                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                                        while (1) {
                                                            switch (_context.prev = _context.next) {
                                                                case 0:
                                                                    preProcessedData = this.preProcess(filteredData);

                                                                    this.postProcessResult(finalResult, preProcessedData, type, schemaPath).then(function (result) {
                                                                        _this4.q = {};
                                                                        return resolve(result);
                                                                    }).catch(reject);

                                                                case 2:
                                                                case "end":
                                                                    return _context.stop();
                                                            }
                                                        }
                                                    }, _callee, this);
                                                }));
                                            }).catch(reject));

                                        case 24:
                                        case "end":
                                            return _context2.stop();
                                    }
                                }
                            }, _callee2, this);
                        }));
                    });
                } catch (error) {
                    return reject(error);
                }
            });
        }
    }, {
        key: "findOne",
        value: function findOne() {
            var _this5 = this;

            this.q.single = true;
            return new Promise(function (resolve, reject) {
                _this5.find().then(function (result) {
                    return resolve(result);
                }).catch(function (error) {
                    return reject(error);
                });
            });
        }
    }, {
        key: "queryOnReferences",
        value: function queryOnReferences(filteredData, finalResult, locale, type, schemaPath) {
            var _this6 = this;

            return new Promise(function (resolve, reject) {
                return _this6.includeReferencesI(filteredData, locale, {}, undefined).then(function () {
                    return __awaiter(_this6, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                        var _this7 = this;

                        var result, preProcessedData;
                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                            while (1) {
                                switch (_context3.prev = _context3.next) {
                                    case 0:
                                        result = sift_1.default(this.q.queryReferences, filteredData);
                                        preProcessedData = this.preProcess(result);

                                        this.postProcessResult(finalResult, preProcessedData, type, schemaPath).then(function (res) {
                                            _this7.q = {};
                                            return resolve(res);
                                        });

                                    case 3:
                                    case "end":
                                        return _context3.stop();
                                }
                            }
                        }, _callee3, this);
                    }));
                }).catch(reject);
            });
        }
    }, {
        key: "findReferences",
        value: function findReferences(query) {
            var _this8 = this;

            return new Promise(function (resolve, reject) {
                var pth = void 0;
                if (query.content_type_uid === '_assets') {
                    pth = path_1.default.join(_this8.baseDir, query.locale, 'assets', '_assets.json');
                } else {
                    pth = path_1.default.join(_this8.baseDir, query.locale, 'data', query.content_type_uid, 'index.json');
                }
                if (!fs_1.default.existsSync(pth)) {
                    return resolve([]);
                }
                return fs_1.default.readFile(pth, 'utf-8', function (readError, data) {
                    if (readError) {
                        return reject(readError);
                    }
                    if (!data) {
                        return resolve();
                    }
                    data = JSON.parse(data);
                    data = lodash_1.map(data, 'data');
                    data = sift_1.default(query.query, data);
                    return resolve(data);
                });
            });
        }
    }, {
        key: "includeReferencesI",
        value: function includeReferencesI(entry, locale, references, parentUid) {
            var _this9 = this;

            var self = this;
            return new Promise(function (resolve, reject) {
                if (entry === null || (typeof entry === "undefined" ? "undefined" : _typeof(entry)) !== 'object') {
                    return resolve();
                }
                if (entry.uid) {
                    parentUid = entry.uid;
                }
                var referencesFound = [];

                var _loop = function _loop(prop) {
                    if (entry[prop] !== null && _typeof(entry[prop]) === 'object') {
                        if (entry[prop] && entry[prop].reference_to) {
                            if (!_this9.q.includeReferences && entry[prop].reference_to === '_assets' || _this9.q.includeReferences) {
                                if (entry[prop].values.length === 0) {
                                    entry[prop] = [];
                                } else {
                                    var uids = entry[prop].values;
                                    if (typeof uids === 'string') {
                                        uids = [uids];
                                    }
                                    if (entry[prop].reference_to !== '_assets') {
                                        uids = lodash_1.filter(uids, function (uid) {
                                            return !utils_1.checkCyclic(uid, references);
                                        });
                                    }
                                    if (uids.length) {
                                        var query = {
                                            content_type_uid: entry[prop].reference_to,
                                            locale: locale,
                                            query: {
                                                uid: {
                                                    $in: uids
                                                }
                                            }
                                        };
                                        referencesFound.push(new Promise(function (rs, rj) {
                                            return self.findReferences(query).then(function (entities) {
                                                entities = lodash_1.cloneDeep(entities);
                                                if (entities.length === 0) {
                                                    entry[prop] = [];
                                                    return rs();
                                                } else if (parentUid) {
                                                    references[parentUid] = references[parentUid] || [];
                                                    references[parentUid] = lodash_1.uniq(references[parentUid].concat(lodash_1.map(entities, 'uid')));
                                                }
                                                if (typeof entry[prop].values === 'string') {
                                                    entry[prop] = entities === null || entities.length === 0 ? null : entities[0];
                                                } else {
                                                    var referenceBucket = [];
                                                    query.query.uid.$in.forEach(function (entityUid) {
                                                        var elem = lodash_1.find(entities, function (entity) {
                                                            return entity.uid === entityUid;
                                                        });
                                                        if (elem) {
                                                            referenceBucket.push(elem);
                                                        }
                                                    });
                                                    entry[prop] = referenceBucket;
                                                }
                                                return self.includeReferencesI(entry[prop], locale, references, parentUid).then(rs).catch(rj);
                                            });
                                        }));
                                    }
                                }
                            }
                        } else {
                            referencesFound.push(self.includeReferencesI(entry[prop], locale, references, parentUid));
                        }
                    }
                };

                for (var prop in entry) {
                    _loop(prop);
                }
                return Promise.all(referencesFound).then(resolve).catch(reject);
            });
        }
    }, {
        key: "preProcess",
        value: function preProcess(filteredData) {
            var _this10 = this;

            var sortKeys = ['asc', 'desc'];
            var sortQuery = Object.keys(this.q).filter(function (key) {
                return sortKeys.includes(key);
            }).reduce(function (obj, key) {
                return Object.assign({}, obj, _defineProperty({}, key, _this10.q[key]));
            }, {});
            if (this.q.asc || this.q.desc) {
                var value = Object.values(sortQuery);
                var key = Object.keys(sortQuery);
                filteredData = lodash_1.orderBy(filteredData, value, key);
            }
            if (this.q.query && Object.keys(this.q.query).length > 0) {
                filteredData = sift_1.default(this.q.query, filteredData);
            } else if (this.q.logical) {
                var operator = Object.keys(this.q.logical)[0];
                var vals = Object.values(this.q.logical);
                var values = JSON.parse(JSON.stringify(vals).replace(/\,/, '},{'));
                var logicalQuery = {};
                logicalQuery[operator] = values;
                filteredData = sift_1.default(logicalQuery, filteredData);
            } else {
                filteredData = filteredData;
            }
            if (this.q.skip && this.q.limit) {
                filteredData = filteredData.splice(this.q.skip, this.q.limit);
            } else if (this.q.skip) {
                filteredData = filteredData.slice(this.q.skip);
            } else if (this.q.limit) {
                filteredData = filteredData.splice(0, this.q.limit);
            }
            if (this.q.only) {
                var only = this.q.only.toString().replace(/\./g, '/');
                filteredData = json_mask_1.default(filteredData, only);
            }
            if (this.q.except) {
                var bukcet = this.q.except.toString().replace(/\./g, '/');
                var except = json_mask_1.default(filteredData, bukcet);
                filteredData = utils_1.difference(filteredData, except);
            }
            if (this.q.tags) {
                filteredData = sift_1.default({
                    tags: {
                        $in: this.q.tags
                    }
                }, filteredData);
            }
            return filteredData;
        }
    }, {
        key: "postProcessResult",
        value: function postProcessResult(finalResult, result, type, schemaPath) {
            var _this11 = this;

            return new Promise(function (resolve, reject) {
                try {
                    if (_this11.q.count) {
                        if (result instanceof Array) {
                            finalResult.count = result.length;
                        } else if (_this11.q.single && result !== undefined) {
                            finalResult.count = 1;
                        } else {
                            finalResult.count = 0;
                        }
                    } else {
                        finalResult[type] = result;
                    }
                    if (_this11.q.single) {
                        delete finalResult[type];
                        type = type === 'entries' ? 'entry' : 'asset';
                        if (result === undefined) {
                            finalResult[type] = {};
                        } else {
                            finalResult[type] = result[0] || result;
                        }
                    }
                    if (_this11.q.include_count) {
                        if (result instanceof Array) {
                            finalResult.count = result.length;
                        } else if (_this11.q.single && result !== undefined) {
                            finalResult.count = 1;
                        } else {
                            finalResult.count = 0;
                        }
                    }
                    if (_this11.q.include_content_type) {
                        if (!fs_1.default.existsSync(schemaPath)) {
                            return reject('content type not found');
                        }
                        var contents = void 0;
                        readFile(schemaPath).then(function (data) {
                            contents = JSON.parse(data);
                            finalResult.content_type = contents;
                            return resolve(finalResult);
                        }).catch(function () {
                            finalResult.content_type = {};
                            return resolve(finalResult);
                        });
                    } else {
                        return resolve(finalResult);
                    }
                } catch (error) {
                    return reject(error);
                }
            });
        }
    }]);

    return Stack;
}();

exports.Stack = Stack;