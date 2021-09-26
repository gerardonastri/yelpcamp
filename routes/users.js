const express = require('express');
const router = express.Router();
const User = require('../models/user');
const cathError = require('../helpers/cathcError');
const passport = require('passport');
const userControllers = require('../controllers/users')

//REGISTER
router.get('/register', userControllers.renderRegisterForm)

router.post('/register', userControllers.register);

//LOGIN
router.get('/login', userControllers.renderLoginForm)

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userControllers.login)

//LOGOUT
router.get('/logout', userControllers.logout)

module.exports = router;
