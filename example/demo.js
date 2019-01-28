var sift = require('sift').default

//var sifted = sifts({ $in: ['hello','world'] }, ['hello','sifted','array!']); //['hello']
var result = 
    //sift({ $in: ["helagelo", "world"] },["hello", "sifted", "array!"])
    sift({state: {$eq: 'MN' }, age: {$lt: 10 }}, [{ state: 'MN', age:8 }, { state: 'CA', age:7 }, { state: 'WI' }]);
  
console.log(result)