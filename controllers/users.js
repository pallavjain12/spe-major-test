const User = require("../models/user");
const logger = require("../loggerFile");
const winston = require("winston");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
  }

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Find Your Happy Place!');
            res.redirect('/happy-place');
            logger.info('New User Registered')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/happy-place';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
    logger.info('New User Logged in Successfully')
}

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/happy-place');
      logger.info('User Logged out Successfully')
    });
  }