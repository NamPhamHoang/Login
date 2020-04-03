module.exports = async (req, res) => {
    if(req.headers.cookie) {
        req.headers.cookie=null
        res.redirect('/login')
    }
}