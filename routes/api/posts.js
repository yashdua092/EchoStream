const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../../schemas/UserSchema')
const Post = require('../../schemas/PostSchema')



app.use(bodyParser.urlencoded({ extended: false })) 

// router will handle the request here not app
// Handler for the /login route(get request)
router.get("/", (req, res, next) => {
    // will handle the get request
    Post.find() // find gives results as a list, if not finding only 1 post
    .populate("postedBy") // we only have user id, not other info about user like name , profile pic etc.
    // to get these need to populate user info using postedBy
    .sort({"createdAt" : -1}) // will sort in descending order to see newer posts first
    .then((results) => {
        res.status(200).send(results)
    })
    .catch(error => {
        console.log(error)
        res.send(404)
    })
})

router.post("/", async (req, res, next) => {
    // will handle the post request

    if(!req.body.content) {
        console.log("content param not sent with request")
        return res.sendStatus(400);
    }

    var postData = {
        content: req.body.content,
        // we have the user from session, not need to pass in request
        postedBy: req.session.user // user info who is posting will be stored and given here
    }

    Post.create(postData) // returns a promise
    .then(async (newPost) => { // .then will get the whole post to perform stuff on that.
        newPost = await User.populate(newPost, { path: "postedBy" })

        res.status(201).send(newPost)
    })
    .catch((error) => {
        console.log(error)
        res.sendStatus(400)
    })


    // res.status(200).send("it worked");
})

module.exports = router