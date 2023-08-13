const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const User = require('../schemas/UserSchema')


// router will handle the request here not app
// Handler for the /login route(get request)
router.get("/", (req, res, next) => {

    var payload = {
        pageTitle: req.session.user.username,
        userLoggedIn: req.session.user, 
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUser: req.session.user
    }


    res.status(200).render("profilePage", payload) // if user requests the home page and not signed in, login page should be rendered.
})

router.get("/:username", async (req, res, next) => {

    var payload = await getPayload(req.params.username, req.session.user)


    res.status(200).render("profilePage", payload) // if user requests the home page and not signed in, login page should be rendered.
})

async function getPayload(username, userLoggedIn) {
    var user = await User.findOne( {username: username} ) // although unique still not a id hence using findOne()

    if(user == null) {
        // if not able to find a user by username try to find by id instead
        user = await User.findById(username) // username here is id
        if(user == null){
            return {
                pageTitle: "User not found",
                userLoggedIn: userLoggedIn, 
                userLoggedInJs: JSON.stringify(userLoggedIn),
            }
        }
    }

    // user found
    return {
        pageTitle: user.username,
        userLoggedIn: userLoggedIn, 
        userLoggedInJs: JSON.stringify(userLoggedIn),
        profileUser: user
    }
}

module.exports = router