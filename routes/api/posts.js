const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../../schemas/UserSchema')
const Post = require('../../schemas/PostSchema')



app.use(bodyParser.urlencoded({ extended: false })) 

// router will handle the request here not app
// Handler for the /login route(get request)
router.get("/", async (req, res, next) => {
    // will handle the get request

    // Post.find() // find gives results as a list, if not finding only 1 post
    // .populate("postedBy") // we only have user id, not other info about user like name , profile pic etc.
    // // to get these need to populate user info using postedBy
    // .populate("retweetData") // populating retweetData(in postSchema contains post id hence will get everything using retweetData after populating)
    // .sort({"createdAt" : -1}) // will sort in descending order to see newer posts first
    // .then(async (results) => {
    //     results = await User.populate(results, { path: "retweetData.postedBy" }) // what to populate, and need to give the path.
    //     res.status(200).send(results)
    // })
    // .catch(error => {
    //     console.log(error)
    //     res.send(404)
    // })

    var results = await getPosts( {} ) // empty to get all the posts
    res.status(200).send(results)
})

router.get("/:id", async (req, res, next) => {
    
    var postId = req.params.id

    var results = await getPosts( {_id: postId}  )
    results = results[0] // need to do this as we are not using findOne, so returns an array instead.
    console.log(results)
    res.status(200).send(results)
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

    if(req.body.replyTo) {
        postData.replyTo = req.body.replyTo // will basically create a new post which will have replyTo array, will store the id of the post replying to.
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

router.post("/:id/retweet", async (req, res, next) => { // can name anything id, newId etc referring to javascript variable
    var postId = req.params.id
    var userId = req.session.user._id
    
    // try and delete retweet(if can :unretweeted, if can't :not existed to begin with)
    var deletedPost = await Post.findOneAndDelete({
        postedBy: userId, 
        retweetData: postId
    })
    .catch((error) => {
        console.log(error)
        res.sendStatus(400)
    })

    var option = deletedPost != null ? "$pull" : "$addToSet";
    
    var repost = deletedPost
    if(repost == null) {
        // create the post or retweet it
        repost = await Post.create({
            postedBy: userId,
            retweetData: postId
        })
        .catch((error) => {
            console.log(error)
            res.sendStatus(400)
        })
    }


    // insert/remove user's retweet               // mongodb will look for field hence used [] here
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { retweets: repost._id } }, { new: true }) // function  takes in the id first and what to update in that as key and object
    
    .catch((error) => {
        console.log(error)
        res.sendStatus(400)
    })

    // insert post like
    var post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } }, { new: true }) // function  takes in the id first and what to update in that as key and object
    .catch((error) => {
        // console.log("executing")
        console.log(error)
        res.sendStatus(400)
    })

    res.status(200).send(post)
})

async function getPosts(filter) {
    var results = await Post.find(filter) // find gives results as a list, if not finding only 1 post
    .populate("postedBy") // we only have user id, not other info about user like name , profile pic etc.
    // to get these need to populate user info using postedBy
    .populate("retweetData") // populating retweetData(in postSchema contains post id hence will get everything using retweetData after populating)
    .populate("replyTo")
    .sort({"createdAt" : -1}) // will sort in descending order to see newer posts first
    .catch(error => {
        console.log(error)
        // res.send(404)
    })
    // .then(async (results) => {
    //     results = await User.populate(results, { path: "retweetData.postedBy" }) // what to populate, and need to give the path.
    //     res.status(200).send(results)
    // })


    results = await User.populate(results, { path: "replyTo.postedBy" }) // will only have id inside replyTo if not done this step.
    return await User.populate(results, { path: "retweetData.postedBy" })
}

module.exports = router