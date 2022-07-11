var ObjectId=require('mongodb').ObjectId;


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mongoproject"; //Connection of ip address with database
var dbCon ;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");

  dbCon= db.db("mongoproject");//return  database object so that we can access the collections in database
  //db.close();
});



module.exports={

post :function(req,res){

    if(req.session.auth)
    {
      console.log(req.body);
      var insertData = {
        "lid" : req.body.lid,
        "lname" : req.body.lname,
        "email" : req.body.lemail,
        "lphno" : req.body.lphno,
        "gender" : req.body.gender,
  
  
      };
  
  
      if(req.body.ukey)
      {
  
        dbCon.collection("libraries").updateOne({"_id":ObjectId(req.body.ukey)},{$set:insertData}, function(err, res1) {
          res.redirect("/");
          // db.close();
          });
      }
    }
}
}
