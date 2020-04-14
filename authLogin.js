var cookieParser = require('cookie-parser')


module.exports = (req, res, next) => {
    //console.log(req.cookies.user)
    if (req.cookies.user==undefined) {
        if(req.route.path=='/login') next() 
        else res.redirect('/login')
    }
    else if(req.cookies.user!= null && req.route.path=='/login') {res.redirect('/')}
        else next() 
            
    
}