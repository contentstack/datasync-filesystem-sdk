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
    'contentStore': {
        'baseDir': '../test/testData'
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
describe('core', function () {
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

    test('initialize stack', function () {
        expect(Contentstack.Stack()).toHaveProperty('connect');
    });

    test('get all entries from contentType of product', function () {

        return Stack.contentType('product').entries().find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(10);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get all entries from contentType of product with count of entries', function () {
        return Stack.contentType('product').entries().includeCount().find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result).toHaveProperty('count');
            expect(result.count).toBe(10);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get all entries from contentType product with content_type', function () {
        return Stack.contentType('product').entries().includeContentType().find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(10);
            expect(result).toHaveProperty('content_type');
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get all entries from contentType product with includeReferences', function () {
        return Stack.contentType('product').entries().includeReferences().find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(10);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product where title=Amazon_Echo_Black ', function () {
        return Stack.contentType('product').entries().where("this.title === 'Amazon_Echo_Black'").find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(1);
            expect(result.entries[0].title).toBe('Amazon_Echo_Black');
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product where  title is equal to Amazon_Echo_Black ', function () {
        return Stack.contentType('product').entries().equalTo("title", "Amazon_Echo_Black").find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(1);
            expect(result.entries[0].title).toBe('Amazon_Echo_Black');
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product which are created before 2018-07-20', function () {
        return Stack.contentType('product').entries().lessThan("created_at", "2018-07-20").find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(10);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product which are created before/on 2018-07-20', function () {
        return Stack.contentType('product').entries().lessThanOrEqualTo("created_at", "2018-07-20").find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(10);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product which are created after 2018-07-20', function () {
        return Stack.contentType('product').entries().greaterThan("created_at", "2018-07-20").find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(0);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product which are created after/on 2018-07-20', function () {
        return Stack.contentType('product').entries().greaterThanOrEqualTo("created_at", "2018-07-20").find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(0);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product by skipping first 2 entries and limiting the entry count to 5', function () {
        return Stack.contentType('product').entries().skip(2).limit(5).find().then(function (result) {
            expect(result.entries[0].title).toEqual('LG_Stylo_2');
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(5);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product by sorting entries in ascending order', function () {
        return Stack.contentType('product').entries().ascending("title").find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries[0].title).toEqual('SADES_A60_7.1');
            expect(result.entries.length).toBe(10);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product by sorting entries in descending order', function () {
        return Stack.contentType('product').entries().descending("title").find().then(function (result) {
            expect(result.entries[0].title).toEqual('All_New_Echo_Dot');
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(10);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product whose title contained ["Amazon_Echo_Black","LG_G3_D850"]', function () {
        return Stack.contentType('product').entries().containedIn("title", ['Amazon_Echo_Black', 'LG_G3_D850']).find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries[0].title).toEqual('Amazon_Echo_Black');
            expect(result.entries[1].title).toEqual('LG_G3_D850');
            expect(result.entries.length).toBe(2);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product whose title notContained ["Amazon_Echo_Black","LG_G3_D850"] ', function () {
        return Stack.contentType('product').entries().notContainedIn("title", ['Amazon_Echo_Black', 'LG_G3_D850']).find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(8);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product with only uid and title of the entry', function () {
        return Stack.contentType('product').entries().only(['title', 'uid']).find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(Object.keys(result.entries[0]).length).toBe(2);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product except uid and title of the entry', function () {
        return Stack.contentType('product').entries().except(['title', 'uid']).find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(Object.keys(result.entries[0]).length).toBe(16);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product by skipping first 5 entries', function () {
        return Stack.contentType('product').entries().skip(5).find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(5);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product by giving limit of 5 entries', function () {
        return Stack.contentType('product').entries().limit(5).find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toBe(5);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product by using query()', function () {
        return Stack.contentType('product').entries().query({ "title": "Amazon_Echo_Black" }).find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries[0].title).toEqual('Amazon_Echo_Black');
            expect(result.entries[0].length).toBe(1);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get only count of entries from contentType product', function () {
        return Stack.contentType('product').entries().count().find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('count');
            expect(result.count).toBe(10);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product using containedIn() ', function () {
        return Stack.contentType('product').entries().containedIn("category.uid", ['bltb1e0f507020e70b1']).includeReferences().find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product using exists() ', function () {
        return Stack.contentType('product').entries().exists('related_products').includeReferences().find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toEqual(10);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product using tags() ', function () {
        return Stack.contentType('product').entries().tags(['amazon']).includeReferences().find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries[0].title).toEqual('Amazon_Echo_Black');
            expect(result.entries[0].length).toBe(1);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries from contentType product for language fr-fr ', function () {
        return Stack.contentType('product').entries().language('fr-fr').find().catch(function (error) {
            expect(error).toBe("content-type or entry not found");
        });
    });

    test('get entries from contentType product without references ', function () {
        return Stack.contentType('product').entries().excludeReferences().findOne().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entry');
            expect(result.entry.title).toEqual('Amazon_Echo_Black');
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get all assets', function () {
        return Stack.assets().find().then(function (result) {
            expect(result.content_type_uid).toEqual('_assets');
            expect(result).toHaveProperty('assets');
            expect(result.assets.length).toEqual(32);
            expect(result.assets[0].uid).toEqual('bltf45225d5a0af61d9');
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get all assets', function () {
        return Stack.assets().language('fr-fr').find().then(function (result) {
            expect(result.content_type_uid).toEqual('_assets');
            expect(result).toHaveProperty('assets');
            expect(result.assets.length).toEqual(0);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get first asset using asset()', function () {
        return Stack.asset().find().then(function (result) {
            expect(result.content_type_uid).toEqual('_assets');
            expect(result).toHaveProperty('asset');
            expect(result.asset.uid).toEqual('bltf45225d5a0af61d9');
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get asset with uid', function () {
        fs.chmodSync('./test/testData/en-us/assets/_assets.json', '000');
        return Stack.asset('bltf45225d5a0af61d9').find().catch(function (error) {
            expect(error).toEqual(error);
        });
    });

    test('get asset with uid', function () {
        fs.chmodSync('./test/testData/en-us/assets/_assets.json', '0755');
        return Stack.asset('bltf45225d5a0af61d9').includeCount().find().then(function (result) {
            expect(result.content_type_uid).toEqual('_assets');
            expect(result).toHaveProperty('asset');
            expect(result.asset.uid).toEqual('bltf45225d5a0af61d9');
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get asset with uid', function () {
        fs.chmodSync('./test/testData/en-us/assets/_assets.json', '0755');
        return Stack.asset('bltf45225d5a0af61d9').count().find().then(function (result) {
            expect(result.content_type_uid).toEqual('_assets');
            expect(result).toHaveProperty('asset');
            expect(result.asset.uid).toEqual('bltf45225d5a0af61d9');
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get asset with uid', function () {
        return Stack.asset('bltf45225d5a0af61d9').language('fr-fr').find().then(function (result) {
            expect(result.content_type_uid).toEqual('_assets');
            expect(result).toHaveProperty('asset');
            expect(Object.keys(result.asset).length).toEqual(0);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entry with uid', function () {
        return Stack.contentType('product').entry('blt88281dee93ce0fdc').find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entry');
            expect(result.entry.uid).toEqual('blt88281dee93ce0fdc');
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entry with uid using findOne()', function () {
        return Stack.contentType('product').entry('blt88281dee93ce0fdc').findOne().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entry');
            expect(result.entry.uid).toEqual('blt88281dee93ce0fdc');
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('call entry() without uid', function () {
        return Stack.contentType('product').entry().findOne().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entry');
            expect(result.entry.title).toEqual('Amazon_Echo_Black');
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('logical query', function () {
        var query = Stack.contentType('product').entries();
        var q1 = Stack.contentType('product').entries().equalTo('title', 'AI');
        var q2 = Stack.contentType('product').entries().lessThan('created_at', '2018-06-22');

        return query.or(q1, q2).descending('title').ascending('created_at').includeCount().includeContentType().find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries.length).toEqual(10);
            expect(result.entries[0].title).toEqual('SADES_A60_7.1');
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries using regex()', function () {
        return Stack.contentType('product').entries().regex('title', '^Amazon').find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries[0].title).toEqual('Amazon_Echo_Black');
            expect(result.entries.length).toEqual(1);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('get entries using queryReferences()', function () {
        return Stack.contentType('product').entries().queryReferences({ 'category.title': 'Home & Appliances' }).find().then(function (result) {
            expect(result.content_type_uid).toEqual('product');
            expect(result).toHaveProperty('entries');
            expect(result.entries[0].title).toEqual('Google_Daydream_View');
            expect(result.entries.length).toEqual(2);
        }).catch(function (error) {
            expect(error).toBe(error);
        });
    });

    test('baseDir', function () {
        var cms = require('../dist').Contentstack;
        var test = cms.Stack({
            'contentStore': {
                'baseDir': '../test/testData'
            }
        });
        return test.connect().then().catch(function (error) {
            expect(error).toBe(error);
        });
    });
});