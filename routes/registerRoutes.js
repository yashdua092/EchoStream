const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser') // to get the data send by the user we need this
const User = require('../schemas/UserSchema')
const bcrypt = require('bcrypt')
// const session = require('express-session')

app.set("view engine", "pug")
app.set("views", "views") // when need a template go to the folder 'views'

app.use(bodyParser.urlencoded({ extended: false })) // false here means body of that req can only contain strings and arrays only.

// router will handle the request here not app
router.get("/", (req, res, next) => {
    res.status(200).render("register") // if user requests the home page and not signed in, register page should be rendered.
})

router.post("/", async (req, res, next) => {

    // console.log(req.body) // the submitted form data(name in input tags returned as key for the object and user entered info as value.)
    var firstName = req.body.firstName.trim() // to get rid of spaces before and after
    var lastName = req.body.lastName.trim()
    var username = req.body.username.trim()
    var email = req.body.email.trim()
    var password = req.body.password

    var payload = req.body
    
    // server side validation
    if(firstName && lastName && username && password) {
        // need to make sure no user exists with this username and email.
        // will query now using findOne func which is asychronous hence used await and async
        var user = await User.findOne({
            $or: [ // instead of writing findOne again and again
                { username: username },
                { email: email } // go to user collection and look for any row/document(here) with username in it.
            ]
        }) // this query returns a promise hence use .then(), .catch()
        // .then((user) => {
        //     console.log(user) // will run after findOne is completed. parameter 'user' is returned by findOne
        // })
        .catch((error) => {
            console.log(error)
            payload.errorMessage = "Something went wrong."
            res.status(200).render("register", payload)
        })

        if(user == null) {
            // no user found
            var data = req.body
            
            data.password = await bcrypt.hash(password, 10) // how many times to do hashing calculation on password(2**10)

            User.create(data) // mongodb stuffs return promise hence async, also mongodb itself validates if data according to schema or not.
            .then((user) => { // .then will get the whole User object to perform stuff on that
                // console.log(user)
                req.session.user = user // starting the session after registering 
                return res.redirect("/")
            })
        }
        else {
            // user found
            if(email == user.email) {
                payload.errorMessage = "email already in use."
            }
            else {
                payload.errorMessage = "username already in use."
            }
            res.status(200).render("register", payload)
        }
    } 
    else {
        payload.errorMessage = "make sure each field has valid value." // if any error other than already exists
        
        res.status(200).render("register", payload) // if user requests the home page and not signed in, register page should be rendered.
        // payload will pass back if some field empty so that user can change. so need to change pug code accordingly.
    }

    // res.status(200).render("register") // if user requests the home page and not signed in, register page should be rendered.
})

module.exports = router