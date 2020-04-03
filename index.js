const express = require('express')
const app = express()
const axios = require('axios')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')


const Data = require('./controllers/dataController')


const loginController = require('./controllers/loginController')
const logoutController = require('./controllers/logoutController')
var cookieParser = require('cookie-parser')
 
app.use(cookieParser())
const authLogin = require('./authLogin.js')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.use('/public', express.static('public'))
const adapter = new FileSync('db.json')
const db = low(adapter)

app.get('/updateLocalDB', function(req,res) {
    axios.get("http://localhost:3000/data").then( function(resp) {
        // Set some defaults
        db.defaults({ personals: []})
        .write()
        db.get('personals').remove({Employee_ID: 1002}).write()
        db.get('personals').remove({Employee_ID: 1001}).write()
        // Add a post
        resp.data.forEach(element => {
            db.get('personals').push(element).write()
        });
        res.send("Updated")
    })
})

app.set("view engine", "pug")
app.set("views", "./views")

app.get('/main', (req, res) =>{
    var personals = db.get('personals').__wrapped__.personals
    var sum = 0;
    var sumByShareHolder = 0;
    var sumByMale = 0;
    var sumByFemale = 0;
    personals.forEach(person => sum+=person.Pay_Rates.Pay_Amount)
    personals.filter(person => person.Shareholder_Status==true).forEach(person => sumByShareHolder+=person.Pay_Rates.Pay_Amount)
    personals.filter(person => person.Gender==true).forEach(person => sumByMale+=person.Pay_Rates.Pay_Amount)
    personals.filter(person => person.Gender==false).forEach(person => sumByFemale+=person.Pay_Rates.Pay_Amount)
    var date = new Date()
    
   var today = date.getFullYear() + ":" + date.get
   
   console.log(today)
    res.render('main', 
        {   personals:personals,
            sum:sum,
            sumByShareHolder: sumByShareHolder,
            sumByMale: sumByMale,
            sumByFemale: sumByFemale
        }
    )  
})
app.get('/login', loginController.getLogin)
app.post('/login', loginController.postLogin)

app.get('/logout', logoutController)

app.use('/data', Data)

app.listen(3000)
