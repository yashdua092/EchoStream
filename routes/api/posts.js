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

router.put("/:id/like", async (req, res, next) => { // can name anything id, newId etc referring to javascript variable
    var postId = req.params.id
    var userId = req.session.user._id
    
    // to like or dislike it, if already inside user's like list: dislike else like
    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId)
    // console.log("is liked" + isLiked)

    var option = isLiked ? "$pull" : "$addToSet";

    // after liking it once, updating the database: user liked but the session hasn't updated
    // therefore if again press the button to dilike it isLiked will be false. so won't remove the like or postId stored in db.
    // could manually update it by equating the following line with 'req.session.user' and adding 'new' at end

    // insert/remove user's like               // mongodb will look for field hence used [] here
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true }) // function  takes in the id first and what to update in that as key and object
    // but here we wanna add to list or remove it so this is used instead
    // if it was the first nama that we were changing then:-
    // User.findByIdAndUpdate(userId, { firstName: "jfhwhjwh" })
    .catch((error) => {
        console.log(error)
        res.sendStatus(400)
    })

    // insert post like
    var post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true }) // function  takes in the id first and what to update in that as key and object
    .catch((error) => {
        // console.log("executing")
        console.log(error)
        res.sendStatus(400)
    })

    res.status(200).send(post)
})

module.exports = router