const express = require('express');
const router = express.Router();
const passport = require('passport');
const AsyncError = require('../utils/AsyncError');
const User = require('../models/user');

router.get('/',(req,res)=>{
    res.redirect('/estates')
})
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register',AsyncError(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to estateBuddy!');
            res.redirect('/estates');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/estates';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            req.flash('error', "Something went wrong");
          return next(err);
        }
        req.flash('success', "Goodbye!");
        res.redirect("/estates");
      });
    
    
})

module.exports = router;