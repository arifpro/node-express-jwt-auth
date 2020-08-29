const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { email: '', password: '' }

    // incorrect email
    if (err.message === 'Incorrect email') {
        errors.email = 'That email is not registered';
    }
    // incorrect password
    if (err.message === 'Incorrect password') {
        errors.password = 'That password is incorrect';
    }


    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'That email is already registered'
        return  errors
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }

    return errors
}

// token
const maxAge= 3 * 24 * 60 * 60;
const createToken = id => {
    return jwt.sign({id}, process.env.SECRET_KEY, {
        expiresIn: maxAge
    });
};


// get controllers
module.exports.signup_get = (req, res) => {
    res.render('signup')
}
module.exports.login_get = (req, res) => {
    res.render('login')
}


// post controllers
module.exports.signup_post = async(req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id })
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}