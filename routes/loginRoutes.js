const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const User = require('../schemas/UserSchema')

app.set("view engine", "pug")
app.set("views", "views") // when need a template go to the folder 'views'

app.use(bodyParser.urlencoded({ extended: false })) 

// router will handle the request here not app
// Handler for the /login route(get request)
router.get("/", (req, res, next) => {
    res.status(200).render("login") // if user requests the home page and not signed in, login page should be rendered.
})

router.post("/", async (req, res, next) => {

    var payload = req.body

    if(req.body.logUserName && req.body.logPassword ) {
        var user = await User.findOne({
            $or: [ // instead of writing findOne again and again
                { username: req.body.logUserName },
                { email: req.body.logUserName } // go to user collection and look for any row/document(here) with username in it.
            ]
        })
        .catch((error) => {
            console.log(error)
            payload.errorMessage = "Something went wrong."
            res.status(200).render("login", payload)
        })

        if(user != null) {
            // need to check that user's password
            var result = await bcrypt.compare(req.body.logPassword, user.password) // compares encrypted one to not encrypted one
            // returns a promise
            // user.password from schema stores the password which gets mongoose instance from database.js

            if(result === true) {
                req.session.user = user
                return res.redirect("/")
            }
            
        }

        payload.errorMessage = "login credentials incorrect"
        return res.status(200).render("login", payload)

    }

    payload.errorMessage = "make sure each field has a valid value"
    res.status(200).render("login") // if user requests the home page and not signed in, login page should be rendered.
})

module.exports = router