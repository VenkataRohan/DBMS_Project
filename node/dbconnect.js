var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "b62ewngmvffjc1nqncsd-mysql.services.clever-cloud.com",
    user: "uqmwoj32exh2j2jv",
    password: "9AEQRyINLjwWkhMHzyBm",
    database: "b62ewngmvffjc1nqncsd"
  });

  // con.query(`select * from new_table`, function (err, result, fields) {
  //   if (err) throw err;
  //   console.log(result);
  //   });


    module.exports={
      con 
  }