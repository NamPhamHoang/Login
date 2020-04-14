module.exports = async (req, res) => {
    if(req.headers.cookie) {
        res.clearCookie('user')
        res.redirect('/login')
    }
}