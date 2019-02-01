var express = require('express')
var app = express()
var Contentstack = require('../dist/index')
var config = require('./config')
var Stack = Contentstack.Stack({"api_key":"","token":""})
app.listen(4000,()=>{
    console.log("Server running on port 4000")
})

Stack.connect(config).then(console.log).catch(console.error)
app.get('/', (req,res)=>{
    //q7
    Stack.contentType('product').entries()
    //.includeCount().includeContentType()
    //.tags(['AI'])
    .findOne()
    .then(function(result){
        res.json(result)
    })

    //q6
    // Stack.contentType('blogs').entries().count().find()
    // .then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })

    //q5
    // Stack.contentType('blogs').entries().query()
    // .where('title','AI')
    // .find()
    // .then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })

    //q4
    // Stack.contentType('product').entries().skip(5).find()
    // .then(function(result){
    //     res.json(result)
    // })

    //q3
    // Stack.contentType('product').entries().where('title','LG_Stylo_2').find()
    // .then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })

    //q2
    // let query= Stack.contentType('blogs').entries()
    // let q1=  Stack.contentType('blogs').entries().equalTo('title', 'AI')
    // let q2=  Stack.contentType('blogs').entries().lessThan('created_at', '2018-06-22')

    // query.and(q1,q2).descending('title').ascending('created_at').includeCount().includeContentType()
    // .except(['title',"blog_name.title", 'data.key1.key2'])
    // .findOne()
    // .then(function(result){
    //     res.json(result)
    // })

    

    //q1
    // Stack.assets().limit(9).find().then(function(result){
    //     console.log("res",result)
    //     res.json(result)
    // })

   

    
})
