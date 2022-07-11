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




router.post('/saveform',function(req,res){
  
  
    if(req.session.auth)
    {
    var p = {
      "lid" : req.body.lname,
      "lname" : req.body.lid,
      "lphno" : req.body.lph,
      "email" : req.body.lemail,
      "gender" : req.body.gender,
    };
  
    var check={
      "lid" : req.body.lname,
    }
    var check1={
      "lname" : req.body.lname,
    }
    
    dbCon.collection("libraries").findOne(check, function(err, result) {
      if(result == null)
      {
      dbCon.collection("libraries").findOne(check1, function(err, result1) {
        if(result1 == null){
    dbCon.collection("libraries").insertOne( p , function(err, res1) {
      if (err) throw err;
        res.redirect("/");
      
      // db.close();
      });
    }
    else{
      res.render('addform');
    }
    });
    }
    else{
      res.render('addform');
    }
  
    });
    
    }
    else{
      res.render('login'); 
    }
    
  })

  module.exports = router;


  
  