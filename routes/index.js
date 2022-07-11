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

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/




router.get('/', function(req, res, next) {
  
  dbCon.collection("libraries").find({}).toArray( function(err, result) {
    if (err) throw err;
      res.render('table2', {"empar":result ,"e" : req.session.variable1});
      
      //db.close();
    });
  

});


module.exports = router;
