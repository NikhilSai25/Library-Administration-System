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
      var months=["January","February","March","April","May","June","July","August","September","October","November","December"]
      var d=req.body.ldate;
  
      var a=d.split("-");
      
      const def = new Date();
  
      var day=def.getDate();
      var mon=def.getMonth()+1; 
      var year=def.getFullYear()
  
      var c=parseInt(a[1]);
      var b=parseInt(a[2]);
      var y=parseInt(a[0]);
      
  
      if(b <= day && c <= mon && y == year){
        
      
      
      var insert={
        "lname" : req.body.lname,
        "lid" : req.body.lid,
        "bookname" : req.body.bname,
        "date" : req.body.ldate,
        "month" : months[c-1],
      };
  
      var check={
        "ltitle" : req.body.bname,
      };
      
      dbCon.collection("library").findOne(check,function(err,resulter){
        if(resulter != null){
        dbCon.collection("books").insertOne(insert,function(err,result){
        if(err) throw err;
        res.redirect("/");
        });
        
      }
      else
      {
        console.log("-------------------------------");
        res.redirect("/");
        console.log("-------------------------------");
      }
      });
    }
    else{
      res.redirect("/");
    }
    }
    else
    {
      res.render('login'); 
    }

    }
}