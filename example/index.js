var express = require('express')
var app = express()
var Stack = require('../src/index.js')
app.listen(3000,()=>{
    console.log("Server running on port 3000")
})
app.get('/', (req,res)=>{
    //q9
    // Stack.contentType('blogs').Query().where('author', 'Chris Bucholtz').includeCount().includeContentType()
    // .tags(['AI'])
    // .find()
    // .then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })

    //q8
    // Stack.ContentType('authors').Query().count().find()
    // .then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })

    //'blt5de2abcc12a85660'
    //q7
    // Stack.contentType('blogs')
    // .entries(['blt5de2abcc12a85660','abc'])
    // .fetch()
    // .then(function(result){
    //     res.json(result)
    // }).catch(err=>{
    //     res.send(err)
    // })

    //q6
    // Stack.ContentType('blogs').Query()
    // .where('title','AI')
    // .find()
    // .then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })


    //q5
    Stack.contentType('blogs').Query().findOne()
    .then(function(result){
        console.log("res",result)
        res.json(result)
    })

    
    //q4
    // Stack.ContentType('authors').Query().where('uid','bltb25ec8e970fbfc9c').find()
    // .then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })

    

    //q3
    // Stack.Assets('blt8d9d6ac3eddd8381').fetch().then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })

    //q1
    // Stack.ContentType('authors').Entry("blt8e74a0404ba2aa4c").fetch().then(function(result) {
    //     //console.log("res",result)
    //     res.json(result)
    // })

    //q2
    // Stack.ContentType('authors').Query().fetch().then(function(result) {
    //     //console.log("res",result)
    //     res.json(result)
    // })
})
