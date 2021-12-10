const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
// const {con} =require('./dbhandler')
const router = express.Router();
const {sendmail}=require('./mail')
var nodemailer = require('nodemailer');

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(bodyParser.urlencoded({ extended: true })); 
var mysql = require('mysql2');

  const pool = mysql.createPool({
    host: "b62ewngmvffjc1nqncsd-mysql.services.clever-cloud.com",
        user: "uqmwoj32exh2j2jv",
        password: "9AEQRyINLjwWkhMHzyBm",
        database: "b62ewngmvffjc1nqncsd",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  var id

app.get('/',function(req,res){
  res.render(__dirname+'/templates/index.html');
});
app.post('/',function(req,res){
          
  pool.getConnection(function(err, con) {
            con.query(`select * from student where student_id=${req.body.name}`, function (err, result, fields) {
              if(err) throw err
                id=req.body.name
              console.log(result[0]);
              if(result.length!=0){
                if(result[0].password==req.body.password)
                res.render(__dirname+'/templates/details.html',{title:result[0]});
                else
               return res.render(__dirname+'/templates/index.html',{msg:'Password incorrect'});
              }else{
               return res.render(__dirname+'/templates/index.html',{msg:'Enter valid id'});
              }
            });
            pool.releaseConnection(con);
          })
         
        
});

var mail,otp
app.post('/forgot_password/otp',function(req,res){
 console.log(req.body);
  
   
if(req.body.otp){
  if(req.body.otp!=otp){
  console.log(req.body.otp)
  console.log(otp);
    return res.render(__dirname+'/templates/otp.html',{msg:'Enter Valid OTP'});
  }
  return res.render(__dirname+'/templates/newpass.html');
        
}else if(req.body.password&&req.body.newpassword){
   if(req.body.password!=req.body.newpassword){
    return res.render(__dirname+'/templates/newpass.html',{msg:'Password does not match'});
  }else{
    pool.getConnection(function(err, con) {
  con.query(`update student set password='${req.body.password}' where student_id=${id}`, function (err, result, fields) {
  if (err) throw err;
 
  });
  pool.releaseConnection(con);
  })
  }
  return res.render(__dirname+'/templates/marks.html');
}else{
  otp=Math.floor(Math.random() * 8999) + 1000;
  id=req.body.name;
    con.connect(function(err) {
      if(err) throw err
      con.query(`select email from student where student_id=${req.body.name}`, function (err, result, fields) {
        if (err) throw err;
        
        console.log(result);
        if(result.length!=0){
        sendmail(result[0].email,otp)
        res.render(__dirname+'/templates/otp.html');
        }else{
          return res.render(__dirname+'/templates/forgotpass.html',{msg:'Enter valid student id'});
        }
          });
          pool.releaseConnection(con);
      }) 
  
       
  }
        console.log(mail);

 // console.log(req.body);
  //if(req.body.password)

  })

app.post('/forgot_password',function(req,res){
console.log(`${otp}  ${mail}`);
res.render(__dirname+'/templates/forgotpass.html');
})

app.get('/forgot_password',function(req,res){
console.log(req.body);
res.render(__dirname+'/templates/forgotpass.html');
})

app.get('/mks',function(req,res){

res.render(__dirname+'/templates/marks.html');
})

app.get('/marks',function(req,res){

  try{
    pool.getConnection(function(err, con) {
    con.query(`select course.Course_name as course_name ,cse.100g as marks from cse inner join course on cse.Course_id=course.Course_id where course.Sem_no=${req.query.semister};`, function (err, result, fields) {
      if (err) throw err;
     
      if (!err)
      {
      if(result)
      return res.render(__dirname+'/templates/marks.html',{title:result});
      
      res.render(__dirname+'/templates/marks.html');
      }else{
       // console.log(err);
        res.render(__dirname+'/templates/marks.html'); 
      }
      });
      pool.releaseConnection(con);
    })
    
  } catch (error) {
    
  }

});

app.get('/atd',function(req,res){

  res.render(__dirname+'/templates/attdance.html');
  })
  
  app.get('/attdance',function(req,res){

 
    try{
      pool.getConnection(function(err, con) {
      con.query(`select course.Course_name as course_name ,cse.100a as attdance from cse inner join course on cse.Course_id=course.Course_id where course.Sem_no=${req.query.semister};`, function (err, result, fields) {
        if (err) throw err;
       
        if(result)
        return res.render(__dirname+'/templates/attdance.html',{title:result});
        res.render(__dirname+'/templates/attdance.html');
        });
        pool.releaseConnection(con);
      })
      
    } catch (error) {
      
    }
      
  
  
  
  });

app.get('/complaints',function(req,res){
  res.render(__dirname+'/templates/complaints.html')
})
app.post('/complaints',function(req,res){
  pool.getConnection(function(err, con) {
  con.query(`INSERT INTO complaints (student_id, complaint) VALUES (${id},'${req.body.text}');`, function (err, result, fields) {
    if (err) throw err;
  
    });
    pool.releaseConnection(con);
  })
  res.render(__dirname+'/templates/complaints.html',{msg:'Your Complaint was registered'})
})
app.get('/addstudent',function(req,res){
  res.render(__dirname+'/templates/staff/addstd.html')
})
app.post('/addstudent',function(req,res){
  pool.getConnection(function(err, con) {
  con.query(`insert into student values(${req.body.student_id},'${req.body.password}','${req.body.studentname}','${req.body.fathername}','${req.body.branch}',${req.body.yjoin},'${req.body.dob}','${req.body.email}');`, function (err, result, fields) {
    if (err) throw err;
    if (err){
      res.render(__dirname+'/templates/staff/addstd.html',{msg:"duplicate student id"})
      console.log(err);
    }else{
      res.render(__dirname+'/templates/staff/home.html')
    }
    
    });
    pool.releaseConnection(con);
  })
  pool.getConnection(function(err, con) {
    con.query(`alter table ${req.body.branch} add(${req.body.student_id}a int default 0,${req.body.student_id}g int default 0);`, function (err, result, fields) {
    //  Alter Table Student ADD(Address Varchar(25), Phone INT, Email Varchar(20));
      if (err) throw err;
      
      });
      pool.releaseConnection(con);
  })
  
})
app.get('/staff_login',function(req,res){
  res.render(__dirname+'/templates/staff/stafflogin.html')
})
app.post('/stafflogin',function(req,res){
  pool.getConnection(function(err, con) {
  con.query(`select * from staff where id=${req.body.name}`, function (err, result, fields) {
    if (err) throw err;
    console.log(result[0]);
    if(result.length!=0){
      if(result[0].password==req.body.password)
     return res.render(__dirname+'/templates/staff/home.html',);
      else
     return res.render(__dirname+'/templates/staff/stafflogin.html',{msg:'Password incorrect'});
    }else{
     return res.render(__dirname+'/templates/staff/stafflogin.html',{msg:'Enter valid id'});
    }
  });
  pool.releaseConnection(con);
})
  
})
var branch
app.get('/staff/update_marks',function(req,res){
 //console.log(Object.keys(req.query));
  
  if(Object.keys(req.query)!=0){
    branch=req.query.branch
    pool.getConnection(function(err, con) {
  con.query(`select Course_id from course where branch='${req.query.branch}' and sem_no=${req.query.semister} ;`, function (err, result, fields) {
    if (err) throw err;
    if(result)
    //console.log(result);
    return res.render(__dirname+'/templates/staff/staffupdatemarks.html',{title:result});
    });
    pool.releaseConnection(con);
  })

  }else{
    res.render(__dirname+'/templates/staff/staffupdatemarks.html');
  }
 
 
})

app.get('/staff/update_attdance',function(req,res){
  console.log(Object.keys(req.query));
   
   if(Object.keys(req.query)!=0){
     branch=req.query.branch
     pool.getConnection(function(err, con) {
   con.query(`select Course_id from course where branch='${req.query.branch}' and sem_no=${req.query.semister} ;`, function (err, result, fields) {
     if (err) throw err;
     if(result)
     //console.log(result);
     return res.render(__dirname+'/templates/staff/staffupdateattdance.html',{title:result});
     });
     pool.releaseConnection(con);
    })
 
   }else{
     res.render(__dirname+'/templates/staff/staffupdateattdance.html');
   }
  
  
 })

var arr=[]
app.post('/staff/update_marks',function(req,res){
  console.log(req.body);
  var q=`update cse set ${req.body.id}g= case course_id`
  for(var pro in req.body){
   //console.log(pro);
    if(req.body[pro]!='' && pro!='id'){
      arr.push(`'${pro}'`)
      q=q+` when '${pro}' then ${req.body[pro]} `
    }
  }
  q=q+`end where course_id in (${arr.toString()}) `
  //console.log(q);
  pool.getConnection(function(err, con) {
  con.query(q, function (err, result, fields) {
    if (err) throw err;
    
    
    });
    pool.releaseConnection(con);
  })
    return res.render(__dirname+'/templates/staff/staffupdateattdance.html');
})

arr=[]
app.post('/staff/update_attdance',function(req,res){
  //console.log(req.body);
  var q=`update cse set ${req.body.id}a= case course_id`
  for(var pro in req.body){
   //console.log(pro);
    if(req.body[pro]!='' && pro!='id'){
      arr.push(`'${pro}'`)
      q=q+` when '${pro}' then ${req.body[pro]} `
    }
  }
  q=q+`end where course_id in (${arr.toString()}) `
  //console.log(q);
  pool.getConnection(function(err, con) {
  con.query(q, function (err, result, fields) {
    if (err) throw err;
    
    });
    pool.releaseConnection(con);
  })
    return res.render(__dirname+'/templates/staff/staffupdatemarks.html');
})


app.get('/staffcomplaints',function(req,res){
  if(Object.keys(req.query)!=0){
    //console.log(req.query);
    if(req.query.action=='remove'){
      pool.getConnection(function(err, con) {
      con.query(`delete from complaints where no=${req.query.id};`, function (err, result, fields) {
        if (err) throw err;
      
        });
        pool.releaseConnection(con);
      })
    }else{
      pool.getConnection(function(err, con) {
      con.query(`update complaints set completed=true where no=${req.query.id};`, function (err, result, fields) {
        if (err) throw err;
       
        });
        pool.releaseConnection(con);
      })
    }
    
  }
  pool.getConnection(function(err, con) {
  con.query(`select * from complaints;`, function (err, result, fields) {
    if (err) throw err;
    
    return res.render(__dirname+'/templates/staff/staffcomplaints.html',{title:result});
    });
    pool.releaseConnection(con);
  })
  
})
app.get('/holidays',function(req,res){
  pool.getConnection(function(err, con) {
  con.query(`select id, day(date) as day,month(date) as month,year(date) as year,holiday from holidays;`, function (err, result, fields) {
    if (err) throw err;
    
    //console.log(result);
    return res.render(__dirname+'/templates/holidays.html',{title:result});
    });
    pool.releaseConnection(con);
  })
})

app.use('/', router);
app.listen(process.env.PORT || 3000);

console.log('Running at Port 3000');