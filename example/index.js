var express = require('express')
var app = express()
var Contentstack = require('../dist/index')
var config = require('./config')
var Stack = Contentstack.Stack(config)
app.listen(5000,()=>{
    console.log("Server running on port 5000")
})

Stack.connect().then(console.log).catch(console.error)
app.get('/', (req,res)=>{
    //q9
    // Stack.contentType('blogs').entries().query().where('author', 'Chris Bucholtz').lessThan("created_at","2018-06-22").includeCount().includeContentType()
    // .tags(['AI'])
    // .find()
    // .then(function(result){
    //     res.json(result)
    // })

    //q8
    // Stack.contentType('blogs').entries().query().count().find()
    // .then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })

    
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
    // Stack.contentType('blogs').entries().query()
    // .where('title','AI')
    // .find()
    // .then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })

    // Stack.contentType('blogs').entries().find()
    // .then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })
    //q5
    // Stack.contentType('blogs').entry('blt5de2abcc12a85660').find()
    // .then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })
    let query= Stack.contentType('blogs').entries().query()
    let q1=  Stack.contentType('blogs').entries().query().equalTo('title', 'AI')
    let q2=  Stack.contentType('blogs').entries().query().lessThan('created_at', '2018-06-22')

    query.or(q1,q2).descending('title').ascending('created_at').includeCount().includeContentType()
    .except(['title',"blog_name.title", 'data.key1.key2'])
    .find()
    .then(function(result){
        res.json(result)
    })

    //q4
    // Stack.ContentType('authors').Query().where('uid','bltb25ec8e970fbfc9c').find()
    // .then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })

    

    //q3
    // Stack.assets().query().where('uid','blta1c0ba87a8f436c5').find().then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })

    //q1
    // Stack.ContentType('authors').Entry("blt8e74a0404ba2aa4c").fetch().then(function(result) {
    //     //console.log("res",result)
    //     res.json(result)
    // })

    
})
