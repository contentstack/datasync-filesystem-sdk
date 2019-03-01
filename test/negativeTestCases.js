'use strict';

function _asyncToGenerator(fn) {
    return function () {
        var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {
            function step(key, arg) {
                try {
                    var info = gen[key](arg);var value = info.value;
                } catch (error) {
                    reject(error);return;
                }if (info.done) {
                    resolve(value);
                } else {
                    return Promise.resolve(value).then(function (value) {
                        step("next", value);
                    }, function (err) {
                        step("throw", err);
                    });
                }
            }return step("next");
        });
    };
}

var Contentstack = require('../dist').Contentstack;
var fs = require('fs');
var Stack = Contentstack.Stack({
    api_key: '',
    access_token: '',
    contentStore: {
        baseDir: '../test/testData'
    },
    locales: [{
        code: 'en-us',
        relative_url_prefix: '/'
    }, {
        code: 'es-es',
        relative_url_prefix: '/es/'
    }]

});
process.env.CONTENT_DIR = '/home/asmit/Documents/trial/test/testData';
describe('negavtive test cases', function () {

    beforeEach(function () {
        return new Promise(function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
                var value;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return Stack.connect();

                            case 3:
                                value = _context.sent;
                                return _context.abrupt('return', resolve(value));

                            case 7:
                                _context.prev = 7;
                                _context.t0 = _context['catch'](0);
                                return _context.abrupt('return', reject(_context.t0));

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, undefined, [[0, 7]]);
            }));

            return function (_x, _x2) {
                return _ref.apply(this, arguments);
            };
        }());
    });

    test('call contentType() without uid', function () {

        expect(function () {
            return Stack.contentType().entries().find();
        }).toThrow();
    });

    test('call entries() directly', function () {

        expect(function () {
            return Stack.entries().find();
        }).toThrow();
    });

    test('call entry() directly', function () {
        expect(function () {
            return Stack.entry().find();
        }).toThrow();
    });

    test('getQuery()', function () {
        expect(Stack.contentType('product').entry().lessThan('created_at', '2017-07-20').getQuery()).toEqual({ 'created_at': { '$lt': '2017-07-20' } });
    });

    test('lessThan()', function () {
        expect(function () {
            return Stack.contentType('product').entry().lessThan('').find();
        }).toThrow();
    });

    test('containedIn()', function () {
        expect(function () {
            return Stack.contentType('product').entry().containedIn('').find();
        }).toThrow();
    });

    test('exists()', function () {
        expect(function () {
            return Stack.contentType('product').entry().exists('').find();
        }).toThrow();
    });

    test('ascending()', function () {
        expect(function () {
            return Stack.contentType('product').entry().ascending('').find();
        }).toThrow();
    });

    test('skip()', function () {
        expect(function () {
            return Stack.contentType('product').entry().skip('').find();
        }).toThrow();
    });

    test('equalTo()', function () {
        expect(function () {
            return Stack.contentType('product').entry().equalTo('').find();
        }).toThrow();
    });

    test('language()', function () {
        expect(function () {
            return Stack.asset('abc').language().find();
        }).toThrow();
    });

    test('where()', function () {
        expect(function () {
            return Stack.contentType('product').entry().where('').find();
        }).toThrow();
    });

    test('tags()', function () {
        expect(function () {
            return Stack.contentType('product').entry().tags('').find();
        }).toThrow();
    });

    test('language()', function () {
        expect(function () {
            return Stack.contentType('product').entry().language('').find();
        }).toThrow();
    });

    test('query()', function () {
        expect(function () {
            return Stack.contentType('product').entry().query('').find();
        }).toThrow();
    });

    test('regex()', function () {
        expect(function () {
            return Stack.contentType('product').entry().regex('').find();
        }).toThrow();
    });

    test('only()', function () {
        expect(function () {
            return Stack.contentType('product').entry().only('').find();
        }).toThrow();
    });

    test('except()', function () {
        expect(function () {
            return Stack.contentType('product').entry().except('').find();
        }).toThrow();
    });

    test('queryReferences()', function () {
        expect(function () {
            return Stack.contentType('product').entry().queryReferences('').find();
        }).toThrow();
    });

    test('get all entries from contentType of product', function () {

        return Stack.contentType('abc').entry('abc').includeCount().find().then(function () {}).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get all entries from contentType of product', function () {

        return Stack.contentType('abc').entry().includeContentType().find().then(function () {}).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get all entries from contentType of product', function () {
        fs.chmodSync('./test/testData/en-us/data/footer/_schema.json', '000');
        return Stack.contentType('footer').entry().includeContentType().find().then(function () {}).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get all entries from contentType of product', function () {
        fs.chmodSync('./test/testData/en-us/data/footer/_schema.json', '755');
        return Stack.asset('acb').language('fr-fr').find().then(function () {}).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get all entries from contentType of product', function () {
        return Stack.asset('acb').language('mr-in').find().then(function () {}).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get all entries from contentType of product', function () {
        return Stack.assets().language('mr-in').find().then(function () {}).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('locale key', function () {
        var cs = require('../dist').Contentstack;
        var stack = cs.Stack({
            'contentStore': {
                'baseDir': '../test/testData'
            },
            'locales': "ds"
        });

        return stack.connect().then().catch(function (error) {
            expect(error).toBe(error);
        });
    });
});