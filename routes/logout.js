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
// Handler for the /logout route
router.get("/", (req, res, next) => {
    if(req.session) {
        req.session.destroy(() => {
            res.redirect("/login")
        })
    }
})

module.exports = router