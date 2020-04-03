var cookieParser = require('cookie-parser')

module.exports = async (req, res, next) => {
        if (!req.headers.cookie) {
            res.redirect('/login')
        }
        else next()
}