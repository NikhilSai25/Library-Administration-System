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

const controller=require("../controller/addbookcontrol");

router.post('/addbooks',controller.post);


/*

router.post('/addbooks',function(req,res){
  

    if(req.session.auth)
    {
    var p = {
      "ltitle" : req.body.ltitle,
      "lauthor" : req.body.lauthor,
      "lpub" : req.body.lpub,
      
    };
      
      async function fetchData() {


        try{
        var employInfo={}
        
        var empInfo = await dbCon.collection("library").insertOne( p );
        
        
        res.redirect("/");
        }
          catch(error)
          {
            console.log(`The error: ${error.message}`);
          }
        }
        
        fetchData();
      
    }
    else{
      res.render('login'); 
    }
    

    
    
  })
*/
  module.exports = router;
  