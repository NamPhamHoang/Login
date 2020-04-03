const express = require('express')
const sql = require('mssql')
var xhr = require("xhr")
const axios = require('axios')
const mysql = require('mysql')


const configMySQL = {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'payroll'
}

var connection = mysql.createConnection(configMySQL)

const router = express.Router()

const configSQLSerVer = {
    user: 'sa',
    password: "moinui123",
    server: 'localhost',
    database: 'HR'
}

function connectDB() {
    sql.connect(configSQLSerVer, (err) => {
        if(err) console.log(err)
        else console.log("connected")
    })
}

sql.connect(configSQLSerVer, (err) => {
    if(err) console.log(err)
    else console.log("connected")
})

connection.connect();

router.get("",function(req,res) {
    axios.get("http://localhost:3000/data/employee").then( function(resp) {
        sql.connect(configSQLSerVer, function (err) {        
            if (err) console.log(err);
            var request = new sql.Request();
            var data = []
            resp.data.forEach(element => {
                connection.query('SELECT * from pay_rates', (err,result) => {
                    let obj=result.filter(each => each.idPay_Rates==element.Pay_Rates)[0];
                    element.Pay_Rates=obj
                    data.push(element)
                    if(data.length==resp.data.length) res.send(data)
                })
            })
        })
    })
})

router.get("/employee",function(req,res) {
    axios.get("http://localhost:3000/data/employment").then( function(resp) {
        sql.connect(configSQLSerVer, function (err) {        
            if (err) console.log(err);
            var request = new sql.Request();
            var data = []
            resp.data.forEach(element => {
                connection.query('SELECT * from employee', (err,result) => {
                    let obj=result.filter(each => each.Employee_Number==element.Employee_ID)[0];
                    element.SSN=obj.SSN
                    element.Pay_Rate=obj.Pay_Rate
                    element.Pay_Rates=obj.PayRates_id
                    element.Vacation_Days=obj.Vacation_Days
                    element.Paid_To_Date=obj.Paid_To_Date
                    element.Paid_Last_Year=obj.Paid_Last_Year
                    data.push(element)
                    if(data.length==resp.data.length) res.send(data)
                })
            })
        })
    })
})
router.get("/benefit",function(req,res) {        
    sql.connect(configSQLSerVer, function (err) {        
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from Personal', function (err, recordset) {
            if (err) console.log(err)
            var data = []
            recordset.recordset.forEach(element => {
                request.query("select * from Benefit_Plans", (err,result) => {
                    element.Benefit_Plans= result.recordset.filter(each => each.Benefit_Plan_ID==element.Benefit_Plans)[0]
                    data.push(element)
                    if(data.length==recordset.recordset.length) res.send(data)
                })
            })  
        });
    })
})

router.get("/emergency",function(req,res) {       
    axios.get("http://localhost:3000/data/benefit").then( function(resp) {
        sql.connect(configSQLSerVer, function (err) {        
            if (err) console.log(err);
            var request = new sql.Request();
            var data = []
            resp.data.forEach(element => {
                request.query("select * from Emergency_Contacts", (err,result) => {
                    element.Emergency= result.recordset.filter(each => each.Employee_ID==element.Employee_ID)[0]
                    data.push(element)
                     if(data.length==resp.data.length) res.send(data)
                })
            })
        })
    })
})

router.get("/jobhistory",function(req,res) {       
    axios.get("http://localhost:3000/data/emergency").then( function(resp) {
        sql.connect(configSQLSerVer, function (err) {        
            if (err) console.log(err);
            var request = new sql.Request();
            var data = []
            resp.data.forEach(element => {
                request.query("select * from Job_History", (err,result) => {
                    element.Job_History= result.recordset.filter(each => each.Employee_ID==element.Employee_ID)[0]
                    data.push(element)
                     if(data.length==resp.data.length) res.send(data)
                })
            })
        })
    })
})

router.get("/employment",function(req,res) {       
    axios.get("http://localhost:3000/data/jobhistory").then( function(resp) {
        sql.connect(configSQLSerVer, function (err) {        
            if (err) console.log(err);
            var request = new sql.Request();
            var data = []
            resp.data.forEach(element => {
                request.query("select * from Employment", (err,result) => {
                    element.Employment= result.recordset.filter(each => each.Employee_ID==element.Employee_ID)[0]
                    data.push(element)
                     if(data.length==resp.data.length) res.send(data)
                })
            })
        })
    })
})

router.get("/users",function(req,res) {
    connection.query('SELECT * from users', (err,result) => {
        res.send(result)
    })
})

module.exports = router 