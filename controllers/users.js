const User = require('../models/user');
const cathError = require('../helpers/cathcError');
const passport = require('passport');

//register
module.exports.renderRegisterForm = (req,res) => {
    res.render('users/register')
}

module.exports.register = cathError(async(req,res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registerUser = await  User.register(user, password);
        req.login(registerUser, err => {
            if(err) return next(err);
            req.flash('succes', 'welcome to yelp camp');
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
})

//LOGIN
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req,res) => {
    req.flash('success', 'welcome back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

//LOGOUT
module.exports.logout = (req,res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/')
}