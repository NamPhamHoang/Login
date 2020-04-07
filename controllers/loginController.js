const mysql = require('mysql')

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

module.exports.getLogin = function (req, res) {
    res.status(200).render("./login.pug")
}

module.exports.postLogin = async (req, res) => {
    connection.query('SELECT * from users', (err,result) => {
        let user=result.filter(each => each.User_Name==req.body.username)[0];
        if (!user) {
            res.status(400).send({
                error: 'User does not exist.'
            })
        } else {
            if (user.Password==req.body.password) {
                res.cookie("username",user.User_Name); 
                res.cookie("password",user.Password); 
                res.status(200).redirect('/')            
            }
            else {
                res.status(500).send({
                    errors: ['Wrong password!']
                })
            }
        }
    })
}