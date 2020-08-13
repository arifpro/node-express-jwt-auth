// get controllers
module.exports.signup_get = (req, res, next) => {
    res.render('signup')
}
module.exports.login_get = (req, res, next) => {
    res.render('login')
}


// post controllers
module.exports.signup_post = (req, res, next) => {
    res.send('new signup')
}
module.exports.login_post = (req, res, next) => {
    res.send('user login')
}