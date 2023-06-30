exports.requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        // if the session property is set
        // and user property is set(when user logins)
        return next() // carry on and do the next step in the cycle of req and responses
    }
    else {
        return res.redirect('/login') // else redirect to login page.
    }
}