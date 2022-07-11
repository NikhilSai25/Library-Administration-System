var express = require('express');
var router = express.Router();


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mongoproject"; //Connection of ip address with database
var dbCon ;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");

  dbCon= db.db("mongoproject");//return  database object so that we can access the collections in database
  //db.close();
});


const controller=require("../controller/showcontrol");

router.post('/show',controller.post);

/*

router.post('/show',function(req,res){
  

  
    var months=["January","February","March","April","May","June","July","August","September","October","November","December"]
  
    
    dbCon.collection("books").find({}).toArray(function(err,result){
        if(err) throw err;
        res.render("display",{"empar" : result ,  "m" : months});
  
      });
    
    
  })
*/
  module.exports = router;


