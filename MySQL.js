const express = require('express')
const mysql = require('mysql')


const configMySQL = {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'payroll'
  }

var connection = mysql.createConnection(configMySQL)
function createConn() {
    connection.connect();
    var data  = []
    connection.query('SELECT * from users', function (error, results, fields) {     
      if (error) throw error;
        for (let index = 0; index < results.length; index++) {
          var currentResults = results[index]
          data.push(results[index])
          if(index==results.length-1)console.log(data)
        }
      });
}
createConn()


