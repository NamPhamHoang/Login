const express = require('express')
const sql = require('mssql')
var xhr = require("xhr")
const axios = require('axios')
const mysql = require('mysql')

const configMySQL = {
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'payroll'
}
//May MINH AN
// const configMySQL = {
//     host     : 'localhost',
//     port     : '3306',
//     user     : 'root',
//     password : '123456',
//     database : 'payroll',
//     insecureAuth : true
// }

var connection = mysql.createConnection(configMySQL)
connection.connect();

const router = express.Router()

const configSQLSerVer = {
    user: 'sa',
    password: "moinui123",
    server: 'localhost',
    database: 'HR'
}

sql.connect(configSQLSerVer, (err) => {
    if(err) console.log(err)
})

router.get('/humanResources', (req, res) => {
    res.status(200).render("./HumanRecources.pug")
}) 

router.get('/salary', (req, res) => {
    res.status(200).render('./Salary.pug')
})

module.exports = router 


