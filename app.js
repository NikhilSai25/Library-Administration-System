var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var {v4: uuidv4}=require('uuid');
var ObjectId=require('mongodb').ObjectId;
const bcrypt = require('bcrypt');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addRouter = require('./routes/addcustomer');
var addbookRouter = require('./routes/addbook');
var issuebookRouter = require('./routes/issuebook');
var graphRouter = require('./routes/aggregate');
var showRouter = require('./routes/showbooks');
var editRouter = require('./routes/editer');



const res = require('express/lib/response');
var app = express();


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mongoproject"; //Connection of ip address with database

var dbCon;
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");

  dbCon= db.db("mongoproject");//return  database object so that we can access the collections in database
  //db.close();
});

//Middleware
const myLogger = function (req, res, next) {

  
  console.log('LOGGED')
  next()
}

app.use(myLogger);

const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(requestTime)


//Trust Proxy
app.set('trust proxy', 1) // trust first proxy //use to accept incoming proxy servers
app.use(session({
  genid: function(req) {
    return uuidv4();  // use UUIDs for session IDs
  },
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge : 300000 } //It creates cookie and maxAge attribute for expired time of the cookie attribute
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/addcustomer', addRouter);
app.use('/addbook', addbookRouter);
app.use('/issuebook', issuebookRouter);
app.use('/aggregate', graphRouter);
app.use('/showbooks', showRouter);
app.use('/editer', editRouter);


// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});
*/
app.get('/login',function(req,res){

  console.log("hi");
  req.session.auth=false;
  console.log(req.session);
  res.render('login');

})



app.post('/sign',function(req,res){
  res.render("signup");
  
})






app.post('/registration',function(req,res){
  
  
  var q={"lid":req.body.sname};
  
  dbCon.collection("libraries").findOne(q,function(err,result){
    if(result){
    if(req.body.sPassword == req.body.cPassword )
    {
      const saltRounds=10;
      const p=req.body.sPassword;

      bcrypt.hash( p , saltRounds, function(err, hash) {

        var insert = {
          "sname" : req.body.sname,
          "sPassword" : hash,
                
        };
        dbCon.collection("libusers").insertOne(insert, function(err, res1){
          res.render("login");
        })    
      

      });
    }
  }
  else
  {
    res.render("signup");
  }
  });
})

app.post('/validate',function(req,res){


  var check={
    "sname" : req.body.empname,
  }
  dbCon.collection("libusers").findOne(check,function(err,result){
    if(err) throw err;
    if(result)
    {
      var p=req.body.Password;
      bcrypt.compare(p , result.sPassword, function(err, result1) {
        if(result1)
        {
          req.session.auth=true;
          req.session.variable1=req.body.empname;
          if(req.session.variable1 == "admin")
          {
          dbCon.collection("libraries").find({}).toArray( function(err, result) {
            if (err) throw err;
              res.render('table2', {"empar":result , "e" : req.session.variable1});
              
              //db.close();
            });
          }
          else
          {
            var c={
              "lid" : req.session.variable1,
            
          }
          
            dbCon.collection("libraries").findOne(c, function(err, result) {
              if (err) throw err;
                res.render('table', {"empar":result , "e" : req.session.variable1});
                
                //db.close();
              });
          }
          
        }
        else
        {
          res.render("signup");
        }     
      });
    }
  })

})


app.route("/ajax")

.get(function(req,res){
  res.render("ajax",{quote : "AJAX"});
})

.post(function(req,res){
   
  res.send({response : req.body.quote});
    
});

/*
app.post('/yawn',function(req,res){
  var insert={
    "lname" : req.body.quote,
  };

  dbCon.collection("books").find(insert).toArray(function(err,result){
    console.log(result);
    res.render("ajax",{"empar" : result,"quote" : req.body.quote});

  });
})
*/
/*
app.post('/saveform',function(req,res){
  
  
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
*/
/*
app.post('/addbooks',function(req,res){
  
  if(req.session.auth)
  {
  var p = {
    "ltitle" : req.body.ltitle,
    "lauthor" : req.body.lauthor,
    "lpub" : req.body.lpub,
    
  };

  dbCon.collection("library").insertOne( p , function(err, res1) {
    if (err) throw err;
      res.redirect("/");
    
    // db.close();
    });
  
  }
  else{
    res.render('login'); 
  }
  
})
*/


app.post('/save',function(req,res){
  
    
  if(req.session.auth)
  {
  var p = {
    "lid" : req.body.lname,
    "lname" : req.body.lid,
    "lphno" : req.body.lphno,
    "email" : req.body.lemail,
    "gender" : req.body.gender,
  };

  dbCon.collection("libraries").insertOne( p , function(err, res1) {
    if (err) throw err;
      res.redirect("/");
    
    // db.close();
    });
  }
  else{
    res.render('login'); 
  }
  
})

/*
app.post("/graph",function(req,res){

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
*/


/*app.post('/books',function(req,res){

  if(req.session.auth)
  {
    var insert={
      "lname" : req.body.lname,
      "lid" : req.body.lid,
      "bookname" : req.body.bname,
      "month" : req.body.month,
    };

    dbCon.collection("books").insertOne(insert,function(err,result){
      if(err) throw err;
      res.redirect("/");
    })
  }
  else
  {
    res.render('login'); 
  }
})*/
/*
app.post('/books',function(req,res){
  
  
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
  
})
*/
app.post('/open',function(req,res){


  
  res.render('addform');
  
  
})

app.post('/addb',function(req,res){

  
  res.render('addbook');
  
})

app.post('/displaybooks',function(req,res){


  dbCon.collection("library").find({}).toArray(function(err,result){
    res.render('displaybooks',{"empar" : result});
  })

})

app.post('/return',function(req,res){
  dbCon.collection("books").find({}).toArray(function(err,result){
    res.render('returnbook',{"empar" : result});
  })

})


app.post('/search',function(req,res){
  res.render("ajax",{"quote" : "search","empar" : 0});

})

app.get('/deletebook/:did?',function(req,res){
  
  
  var ddid=req.params.did;
  

  async function fetchData() {



    try{
    
    var empInfo = await dbCon.collection("books").deleteOne({"_id":ObjectId(ddid)});
    
    var branchInfo = await dbCon.collection("books").find({}).toArray();
    
    res.render('returnbook',{"empar" : branchInfo});
    }
    catch(error)
    {
      console.log(`The error: ${error.message}`);
    }
    
    }
  

    fetchData();
  
  
    /*
  dbCon.collection("books").deleteOne({"_id":ObjectId(ddid)}, function(err, result){//->Callback function 
    if (err)
    {reject(err);}
    
    dbCon.collection("books").find({}).toArray(function(err,result){
      res.render('returnbook',{"empar" : result});
    })
  });
*/
})  



app.post('/logout',function(req,res){
  
  req.session.destroy(function(){ //destroy the session 
    res.render('login'); 
  })
})




app.post('/add',function(req,res){

  

  async function fetchData() {
    try{
    var emp=await dbCon.collection("libraries").find({}).toArray();
    
    res.render('table2', {"empar":emp , "e" : req.session.variable1});
    }
    catch(error)
    {
      console.log(`The error: ${error.message}`);
    }
  }

  fetchData();

    

  /*
  dbCon.collection("libraries").find({}).toArray( function(err, result) {
    if (err) throw err;
      res.render('table2', {"empar":result , "e" : req.session.variable1});
      
      //db.close();
    })
    */
})

app.post('/a',function(req,res){

  var c={
    "lid" : req.session.variable1,
  
}
  dbCon.collection("libraries").findOne(c, function(err, result) {
    if (err) throw err;
      res.render('table', {"empar":result , "e" : req.session.variable1});
      
      //db.close();
    });
})



app.get('/issuebook/:eid',function(req,res){

  
  
  var eeid=req.params.eid;
  var ddid=req.params.did;
  dbCon.collection("libraries").findOne({"_id" : ObjectId(eeid)},function(err,result){

    res.render("issuebook",{"empar" : result});

  });  
  
  
  
})




app.get('/delete/:did?',function(req,res){
  
  
  
  
  var ddid=req.params.did;
  
  async function fetchData() {

    try{
    var emp=await dbCon.collection("libraries").deleteOne({"_id":ObjectId(ddid)});

    res.redirect("/");
    }
    catch(error)
  {
    console.log(`The error: ${error.message}`);
  }  


  }
  fetchData();

    /*
  dbCon.collection("libraries").deleteOne({"_id":ObjectId(ddid)}, function(err, result){//->Callback function 
    if (err)
    {reject(err);}
    
    res.redirect("/");
  });
  */



})  

app.get('/edit/:eid?',function(req,res){
  
  
  
  var eeid=req.params.eid;
  
  var genders=[{name : "Male"},{name : "Female"},{name : "Other"}];


  async function fetchData() {
    
    try{
    var emp=await dbCon.collection("libraries").findOne({"_id":ObjectId(eeid)});
    res.render("editcustomers",{"empar" : emp,"genders" : genders});
    }
    catch(error)
    {
      console.log(`The error: ${error.message}`);
    }  

  }

  fetchData();


  /*
  dbCon.collection("libraries").findOne({"_id":ObjectId(eeid)}, function(err, result){//->Callback function 
    if (err)
    {reject(err);}
    
    res.render("editcustomers",{"empar" : result,"genders" : genders});
  });
  */
})  

/*

app.post('/saveedit',function(req,res){
  
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
  
})


*/


/*
app.post('/show',function(req,res){
  

  
  var months=["January","February","March","April","May","June","July","August","September","October","November","December"]

  
  dbCon.collection("books").find({}).toArray(function(err,result){
      if(err) throw err;
      res.render("display",{"empar" : result ,  "m" : months});

    });
  
  
})
*/



app.post('/sh',function(req,res){
  

  
  var months=["January","February","March","April","May","June","July","August","September","October","November","December"]

  var c={
    "lname" : req.session.variable1,
  }
  
  dbCon.collection("books").find(c).toArray(function(err,result){
      if(err) throw err;
      res.render("show",{"empar" : result ,  "m" : months});

    });
  
  
})



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
