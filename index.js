const express = require('express')
const app = express()
const axios = require('axios')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const Data = require('./controllers/dataController')
const Admin = require('./controllers/adminController')
const loginController = require('./controllers/loginController')
const editController = require('./controllers/editController')
const logoutController = require('./controllers/logoutController')
var cookieParser = require('cookie-parser')
app.use(cookieParser())
const authLogin = require('./authLogin.js')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/public', express.static('public'))
const adapter = new FileSync('db.json')
const db = low(adapter)

app.get('/updateLocalDB', function(req,res) {
    axios.get("http://localhost:3000/data").then( function(resp) {
        // Set some defaults
        db.defaults({ personals: []})
        .write()
        db.set('personals', []).write()
        // Add a post
        resp.data.forEach(element => {
            db.get('personals').push(element).write()
        });
        res.send("Updated")
    })
})

app.set("view engine", "pug")
app.set("views", "./public/views")

app.get('/', authLogin, (req, res) =>{
    var personals = db.get('personals').__wrapped__.personals
    var sum = 0;
    var sumByShareHolder = 0;
    var sumByMale = 0;
    var sumByFemale = 0;
    var sumByHumanDepart = 0;
    var sumByAccounting = 0;
    personals.forEach(person => sum+=person.Pay_Rates.Pay_Amount)
    personals.filter(person => person.Shareholder_Status==true).forEach(person => sumByShareHolder+=person.Pay_Rates.Pay_Amount)
    personals.filter(person => person.Gender==true).forEach(person => sumByMale+=person.Pay_Rates.Pay_Amount)
    personals.filter(person => person.Gender==false).forEach(person => sumByFemale+=person.Pay_Rates.Pay_Amount)
    //personals.filter(person => person.Job_History.Departmen_Code==2).forEach(person => sumByHumanDepart+=person.Pay_Rates.Pay_Amount)
    //personals.filter(person =>  person.Job_History.Departmen_Code==201).forEach(person => sumByAccounting+=person.Pay_Rates.Pay_Amount)
    res.render('main', 
        {   personals:personals,
            sum:sum,
            sumByShareHolder: sumByShareHolder,
            sumByMale: sumByMale,
            sumByFemale: sumByFemale,
            //sumByHuman: sumByHumanDepart,
            //sumByAccounting: sumByAccounting,
            user: req.cookies.user
        }
    )  
})

app.get('/main', (req,res) => {
    res.redirect('/')
})


//authen path
app.get('/login', authLogin, loginController.getLogin)
app.post('/login', loginController.postLogin)
app.get('/logout', authLogin, logoutController)
app.use('/edit', editController)

//admin path
app.use('/data', Data)
app.use('/admin', authLogin, Admin)


app.listen(3000,() => console.log("Listening PORT 3000."))

// var max = 0
// db.get('personals').value().forEach(element => { if(max<=element.Employee_ID) max=element.Employee_ID;})
// console.log(max+1)