const Contentstack = require('../dist').Contentstack
const fs = require('fs')
let Stack = Contentstack.Stack({
    api_key: '',
    access_token: '',
    contentStore: {
        baseDir: '../test/testData'
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
process.env.contentBaseDir = '/home/asmit/Documents/trial/test/testData'
describe('negavtive test cases',()=>{

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

    test('call contentType() without uid', () => {
       
        expect(() => {
            return Stack
            .contentType()
            .entries()
            .find()
          }).toThrow();
    })

    test('call entries() directly', () => {
        
        expect(() => {
            return Stack
            .entries()
            .find()
          }).toThrow();

    })

    test('call entry() directly', () => {
        expect(() => {
            return Stack
            .entry()
            .find()
          }).toThrow()

    })

    test('getQuery()', () => {
        expect(
            Stack.contentType('product')
            .entry()
            .lessThan('created_at','2017-07-20')
            .getQuery()
          ).toEqual({ 'created_at': { '$lt': '2017-07-20' } });

    })

    test('lessThan()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .lessThan('')
            .find()
          }).toThrow()
    })

    test('containedIn()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .containedIn('')
            .find()
          }).toThrow()
    })

    test('exists()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .exists('')
            .find()
          }).toThrow()
    })

    test('ascending()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .ascending('')
            .find()
          }).toThrow()
    })

    test('skip()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .skip('')
            .find()
          }).toThrow()
    })

    test('equalTo()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .equalTo('')
            .find()
          }).toThrow()
    })

    test('language()', () => {
        expect(() => {
            return Stack
            .asset('abc')
            .language()
            .find()
          }).toThrow()
    })

    test('where()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .where('')
            .find()
          }).toThrow()
    })

    test('tags()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .tags('')
            .find()
          }).toThrow()
    })

    test('language()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .language('')
            .find()
          }).toThrow()
    })

    test('query()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .query('')
            .find()
          }).toThrow()
    })

    test('regex()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .regex('')
            .find()
          }).toThrow()
    })

    test('only()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .only('')
            .find()
          }).toThrow()
    })
    

    test('except()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .except('')
            .find()
          }).toThrow()
    })

    test('queryReferences()', () => {
        expect(() => {
            return Stack.contentType('product')
            .entry()
            .queryReferences('')
            .find()
          }).toThrow()
    })
    
    
    test('get all entries from contentType of product', () => {
        
        return Stack.contentType('abc')
            .entry('abc')
            .includeCount()
            .find()
            .then(function () {
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get all entries from contentType of product', () => {
        
        return Stack.contentType('abc')
            .entry()
            .includeContentType()
            .find()
            .then(function () {
            })
            .catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get all entries from contentType of product', () => {
        fs.chmodSync('./test/testData/en-us/data/footer/_schema.json','000')
        return Stack.contentType('footer')
            .entry()
            .includeContentType()
            .find()
            .then(function () {
            })
            .catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get all entries from contentType of product', () => {
        fs.chmodSync('./test/testData/en-us/data/footer/_schema.json','755')
        return Stack.asset('acb')
            .language('fr-fr')
            .find()
            .then(function () {
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get all entries from contentType of product', () => {
        return Stack.asset('acb')
            .language('mr-in')
            .find()
            .then(function () {
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })

    test('get all entries from contentType of product', () => {
        return Stack.assets()
            .language('mr-in')
            .find()
            .then(function () {
            }).catch((error) => {
                expect(error).toBe(error)
            })
    })



    test('locale key', () => {
        const cs = require('../dist').Contentstack
        let stack = cs.Stack({
            'contentStore': {
                'baseDir': '../test/testData'
            },
            'locales':"ds"
        })
        
            return stack
            .connect().then().catch((error)=>{
                expect(error).toBe(error)
            })
    })

})