const express = require('express')
const sql = require('mssql')
var xhr = require("xhr")
const axios = require('axios')
const mysql = require('mysql')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const body_parser = require('body-parser')
const adapter = new FileSync('db.json')
const db = low(adapter)

const configMySQL = {
    host     : 'localhost',
    user     : 'root',
    password : '',
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
var conn = sql.connect(configSQLSerVer, (err) => {
    if(err) console.log(err)
})

//get edit
router.get('/update', (req, res) => {
    const user = db.get('personals').find({Employee_ID: Number(req.query.id)}).value()
    res.status(200).render("HumanRecources.pug", {user: user, path: req.route.path}) 
}) 

//post edit 
router.post('/update', (req, res)=> {
    var user = req.body;
    var name = user.last_name
    console.log(user)
    var query = new sql.Request(conn);
    query.query(`UPDATE Personal SET 
    First_Name = '${user.first_name}', 
    Last_Name = '${user.last_name}',
    Phone_Number = '${user.phone}',
    City = '${user.city}',
    Email = '${user.email}'
    where Employee_ID = '${(Number(user.employee_id))}'; Update Job_History SET Department = '${user.department}' where Employee_ID = '${(Number(user.employee_id))}'`, function (err,results){
        if(err) {
            console.log(err)
        }
        else {res.send('success'); axios.get("http://localhost:3000/updateLocalDB");}
    })
})

router.get('/add', (req, res) => {
    var max = 0
    db.get('personals').value().forEach(element => { if(max<=element.Employee_ID) max=element.Employee_ID;})
    max++
    const user = {
        Employee_ID: max,
        Job_History: {Department: ''},
        Last_Name: '',
        First_Name: '',
        Email: '',
        City: '',
        Phone_Number: ''
    }
    res.status(200).render("HumanRecources.pug", {user: user, path: req.route.path}) 
}) 

router.post('/add', (req, res)=> {
    //db.get('personals').value()[db.get('personals').value().length-1].Employee_ID
    var user = req.body;
    var query = new sql.Request(conn);
    // element.SSN=obj.SSN
    //element.Pay_Rate=obj.Pay_Rate
    //element.Pay_Rates=obj.PayRates_id
    //element.Vacation_Days=obj.Vacation_Days
    //element.Paid_To_Date=obj.Paid_To_Date
    //element.Paid_Last_Year=obj.Paid_Last_Year
    query.query(`INSERT INTO Personal (Employee_ID, First_Name, Last_Name, Phone_Number, City, Email, Shareholder_Status) values (
    ${user.employee_id},
    '${user.first_name}', 
    '${user.last_name}',
    '${user.phone}',
    '${user.city}',
    '${user.email}',
    'true'); INSERT INTO Job_History (Employee_ID, Department) Values (${user.employee_id}, '${user.department}')`, function (err,results){
        if(err) {
            console.log(err)
        }
        else {
            connection.query(`INSERT INTO employee (
                Employee_Number,
                idEmployee,
                SSN,
                First_Name,
                Last_Name,
                Pay_Rate,
                PayRates_id,
                Vacation_Days,
                Paid_To_Date,
                Paid_Last_Year) Values (
                    ${user.employee_id},
                    ${user.employee_id}%1000,
                    123456,
                    '${user.first_name}', 
                    '${user.last_name}',
                    3.0,
                    1,
                    10,
                    99,
                    99
                )`)
            if(err) {
                console.log(err)
            }
            else {res.send('success'); axios.get("http://localhost:3000/updateLocalDB");}
        }
    })
})



router.get('/remove', (req, res) => {
    var query = new sql.Request(conn);
    query.query(`DELETE From Job_History where Employee_ID = ${req.query.id}; 
    DELETE from Personal where Employee_ID = ${req.query.id}`, function (err,results){
       if(err) console.log(err)
        else {
            connection.query(`DELETE From employee where Employee_Number = ${req.query.id}`)
            if(err) {
                console.log(err)
            }
            else {axios.get("http://localhost:3000/updateLocalDB"); res.redirect('/')}
        }
    })
})

module.exports = router