const Contentstack = require('../dist/contentstack').Contentstack
const fs = require('fs')
let Stack = Contentstack.Stack({
    api_key: '',
    access_token: '',
    'contentStore': {
        'baseDir': './test/testData'
    },
    locales: [
        {
            code: 'en-us',
            relative_url_prefix: '/'
        },
        {
            code: 'es-es',
            relative_url_prefix: '/es/'
        }
    ]

})
//Stack.connect().catch()
describe('core', () => {
    beforeEach(() => {
        return new Promise(async (resolve, reject) => {
            try {
                const value = await Stack.connect();
                return resolve(value);
            }
            catch (reason) {
                return reject(reason);
            }
        })
        
    })

    test('initialize stack', () => {
        expect(Contentstack.Stack()).toHaveProperty('connect')
    })

    test('get all entries from contentType of product', () => {
        
        return Stack.contentType('product')
            .entries()
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(result.entries.length).toBe(10)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get all entries from contentType of product with count of entries', () => {
        return Stack.contentType('product')
            .entries()
            .includeCount()
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('count')
                expect(result.count).toBe(10)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get all entries from contentType product with content_type', () => {
        return Stack.contentType('product')
            .entries()
            .includeContentType()
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('content_type')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })


    test('get all entries from contentType product with includeReferences', () => {
        return Stack.contentType('product')
            .entries()
            .includeReferences()
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(result.entries.length).toBe(10)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product where title=Amazon_Echo_Black ', () => {
        return Stack.contentType('product')
            .entries()
            .where("this.title === 'Amazon_Echo_Black'")
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(result.entries[0].title).toBe('Amazon_Echo_Black')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product where  title is equal to Amazon_Echo_Black ', () => {
        return Stack.contentType('product')
            .entries()
            .equalTo("title", "Amazon_Echo_Black")
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(result.entries[0].title).toBe('Amazon_Echo_Black')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product which are created before 2018-07-20', () => {
        return Stack.contentType('product')
            .entries()
            .lessThan("created_at", "2018-07-20")
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(result.entries.length).toBe(10)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product which are created before/on 2018-07-20', () => {
        return Stack.contentType('product')
            .entries()
            .lessThanOrEqualTo("created_at", "2018-07-20")
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(result.entries.length).toBe(10)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product which are created after 2018-07-20', () => {
        return Stack.contentType('product')
            .entries()
            .greaterThan("created_at", "2018-07-20")
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(result.entries.length).toBe(0)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product which are created after/on 2018-07-20', () => {
        return Stack.contentType('product')
            .entries()
            .greaterThanOrEqualTo("created_at", "2018-07-20")
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(result.entries.length).toBe(0)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product by skipping first 2 entries and limiting the entry count to 5', () => {
        return Stack.contentType('product')
            .entries()
            .skip(2)
            .limit(5)
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(result.entries.length).toBe(5)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product by sorting entries in ascending order', () => {
        return Stack.contentType('product')
            .entries()
            .ascending("title")
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(result.entries.length).toBe(10)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product by sorting entries in descending order', () => {
        return Stack.contentType('product')
            .entries()
            .descending("title")
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(result.entries.length).toBe(10)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product whose title contained ["Amazon_Echo_Black","LG_G3_D850"]', () => {
        return Stack.contentType('product')
            .entries()
            .containedIn("title", ['Amazon_Echo_Black', 'LG_G3_D850'])
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(result.entries.length).toBe(2)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product whose title notContained ["Amazon_Echo_Black","LG_G3_D850"] ', () => {
        return Stack.contentType('product')
            .entries()
            .notContainedIn("title", ['Amazon_Echo_Black', 'LG_G3_D850'])
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(result.entries.length).toBe(8)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product with only uid and title of the entry', () => {
        return Stack.contentType('product')
            .entries()
            .only(['title', 'uid'])
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(Object.keys(result.entries[0]).length).toBe(2)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product except uid and title of the entry', () => {
        return Stack.contentType('product')
            .entries()
            .except(['title', 'uid'])
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
                expect(Object.keys(result.entries[0]).length).toBe(16)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product by skipping first 5 entries', () => {
        return Stack.contentType('product')
            .entries()
            .skip(5)
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product by giving limit of 5 entries', () => {
        return Stack.contentType('product')
            .entries()
            .limit(5)
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product by using query()', () => {
        return Stack.contentType('product')
            .entries()
            .query({ "title": "Amazon_Echo_Black" })
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get only count of entries from contentType product', () => {
        return Stack.contentType('product')
            .entries()
            .count()
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('count')
                expect(result.count).toBe(10)
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product using containedIn() ', () => {
        return Stack.contentType('product')
            .entries()
            .containedIn("category.uid", ['bltb1e0f507020e70b1'])
            .includeReferences()
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product using exists() ', () => {
        return Stack.contentType('product')
            .entries()
            .exists('related_products')
            .includeReferences()
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })
    
    test('get entries from contentType product using tags() ', () => {
        return Stack.contentType('product')
            .entries()
            .tags(['amazon'])
            .includeReferences()
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product for language fr-fr ', () => {
        return Stack.contentType('product')
            .entries()
            .language('fr-fr')
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries from contentType product without references ', () => {
        return Stack.contentType('product')
            .entries()
            .excludeReferences()
            .findOne()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get all assets', () => {
        return Stack
            .assets()
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('_assets')
                expect(result).toHaveProperty('assets')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get all assets', () => {
        return Stack
            .assets()
            .language('fr-fr')
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('_assets')
                expect(result).toHaveProperty('assets')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get first asset using asset()', () => {
        return Stack
            .asset()
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('_assets')
                expect(result).toHaveProperty('asset')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get asset with uid', () => {
        fs.chmodSync('./test/testData/en-us/assets/_assets.json','000')
        return Stack.asset('bltf45225d5a0af61d9')
            .find()
            .then(function (result) {
                console.log(result)
                expect(result.content_type_uid).toEqual('_assets')
                expect(result).toHaveProperty('asset')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get asset with uid', () => {
        fs.chmodSync('./test/testData/en-us/assets/_assets.json','0755')
        return Stack.asset('bltf45225d5a0af61d9').includeCount()
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('_assets')
                expect(result).toHaveProperty('asset')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get asset with uid', () => {
        return Stack.asset('bltf45225d5a0af61d9').language('fr-fr')
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('_assets')
                expect(result).toHaveProperty('asset')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })


    test('get entry with uid', () => {
        return Stack.contentType('product')
            .entry('blt88281dee93ce0fdc')
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entry')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entry with uid using findOne()', () => {
        return Stack.contentType('product')
            .entry('blt88281dee93ce0fdc')
            .findOne()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entry')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('call entry() without uid', () => {
        return Stack.contentType('product')
            .entry()
            .findOne()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entry')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('logical query', () => {
        let query = Stack.contentType('product').entries()
        let q1 = Stack.contentType('product').entries().equalTo('title', 'AI')
        let q2 = Stack.contentType('product').entries().lessThan('created_at', '2018-06-22')

        return query.or(q1, q2).descending('title').ascending('created_at').includeCount().includeContentType()
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries using regex()', () => {
        return Stack.contentType('product')
            .entries()
            .regex('title', '^Amazon')
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get entries using queryReferences()', () => {
        return Stack.contentType('product')
            .entries()
            .queryReferences({ 'category.title': 'Home & Appliances' })
            .find()
            .then(function (result) {
                expect(result.content_type_uid).toEqual('product')
                expect(result).toHaveProperty('entries')
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('baseDir', () => {
        const cms = require('../dist/contentstack').Contentstack
        let test = cms.Stack({
            'contentStore': {
                'baseDir': '../test/testData'
            },
        })
            return test
            .connect().then().catch((error)=>{
                expect(error).toBe(error)
            })
    })

   

})  