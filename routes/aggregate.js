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



router.post("/graph",function(req,res){

    const col=dbCon.collection('books');
  
    const pipeline = [
      { $match: { } },
      { $group: { _id: "$month", count: { $sum: 1 } } }
    ];
  
    const agg=col.aggregate(pipeline).toArray(function(err,result){
      if(err)
      console.log(err);
  
          var a=[];
          var b=[];
          var mon=["January","February","March","April","May","June","July","August","September","October","November","December"];
         for(let i=0;i<result.length;i++)
          {
            a.push(result[i]._id);
            b.push(result[i].count);
          }
          console.log(a);  
          for(let i=0;i<mon.length;i++)
        {
          let flag=0;
          for(let j=0;j<result.length;j++)
          {
            if(mon[i] == result[j]._id)
            {
              flag+=1;
              break;
            }
          }
          if(flag == 0)
          {
            a.push(mon[i]);
            b.push(0);
          }
   
        }
  
        console.log(a);
        console.log(b);
  
        var elf=[];
        var letters=[1,2,3,4,5,6,7,8,9,10,11,12];
        for(let i=0;i<mon.length;i++)
        {
          for(let j=0;j<a.length;j++)
          {
            if(mon[i] == a[j])
            {
              elf.push(b[j]);
            }
          }
  
        }
  
        
  
          
          
      res.render("grapher",{"months" : letters , "count" : elf});
     
    })
    
  })


  router.post("/pie",function(req,res){

    const col=dbCon.collection('books');
  
    const pipeline = [
      { $match: { } },
      { $group: { _id: "$month", count: { $sum: 1 } } }
    ];
  
    const agg=col.aggregate(pipeline).toArray(function(err,result){
      if(err)
      console.log(err);
  
          var a=[];
          var b=[];
          var mon=["January","February","March","April","May","June","July","August","September","October","November","December"];
         for(let i=0;i<result.length;i++)
          {
            a.push(result[i]._id);
            b.push(result[i].count);
          }
          console.log(a);  
          for(let i=0;i<mon.length;i++)
        {
          let flag=0;
          for(let j=0;j<result.length;j++)
          {
            if(mon[i] == result[j]._id)
            {
              flag+=1;
              break;
            }
          }
          if(flag == 0)
          {
            a.push(mon[i]);
            b.push(0);
          }
   
        }
  
        console.log(a);
        console.log(b);
  
        var elf=[];
        var letters=[1,2,3,4,5,6,7,8,9,10,11,12];
        for(let i=0;i<mon.length;i++)
        {
          for(let j=0;j<a.length;j++)
          {
            if(mon[i] == a[j])
            {
              elf.push(b[j]);
            }
          }
  
        }
  
        
  
          
          
      res.render("piegraph",{"months" : letters , "count" : elf});
     
    })
    
  })

  module.exports = router;
  