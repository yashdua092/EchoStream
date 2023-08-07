const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const User = require('../schemas/UserSchema')


// router will handle the request here not app
// Handler for the /login route(get request)
router.get("/:id", (req, res, next) => {

    var payload = {
        pageTitle: "View Post",
        userLoggedIn: req.session.user, 
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id
    }


    res.status(200).render("postPage", payload) // if user requests the home page and not signed in, login page should be rendered.
})


module.exports = router