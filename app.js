const express = require('express')
const app = express()
const port = 3000
const middleware = require('./middleware')
const path = require('path') // path module
const bodyParser = require('body-parser')
const mongoose = require('./database') // as soon as the user hit the request for root page, will be connected to the database 
const session = require('express-session')

// takes in 2 parameters: port no. where listening and code that fires when listening.
const server = app.listen(port, () => console.log("server listening on port 3000")) // this function starts the server for the whole application.

app.set("view engine", "pug")
app.set("views", "views") // when need a template go to the folder 'views'

app.use(bodyParser.urlencoded({ extended: false })) // false here means body of thar req can only contain strings and arrays only.
// app.use(express.static("public")) //public folder contains all static files that need not to be processed by server
app.use(express.static(path.join(__dirname, "public")))

app.use(session({
    secret: "bbq sauce", // will use this string to hash the session
    resave: true, // saved the session
    saveUninitialized: false // don't save if not set.
}))

// Routesf
const loginRoute = require('./routes/loginRoutes')
const registerRoute = require('./routes/registerRoutes')
const logoutRoute = require('./routes/logout')
const postRoute = require('./routes/postRoutes')
const profileRoute = require('./routes/profileRoutes')

// API routes
const postsApiRoute = require('./routes/api/posts');


// app.use() is used to setup middleware for the application.
// from main page to different pages basically.
app.use("/login", loginRoute) // after returning from middleware, need to get the user to login if already registered. this is where it will go from middleware.
app.use("/register", registerRoute)
app.use("/logout", logoutRoute)
app.use("/posts", middleware.requireLogin, postRoute)
app.use("/profile", middleware.requireLogin, profileRoute)


app.use("/api/posts", postsApiRoute)

app.get("/", middleware.requireLogin, (req, res, next) => {
// this function tackles what happens when user request the root of the site.(home page)
    var payload = {
        pageTitle: "Hola",
        userLoggedIn: req.session.user, // info about the user which was stored in req.session.user is given to userLoggedIn and hence payload which is sent to pug file.
        // we cannot use this on the client side, only on the server side but need it to show whether already liked or not etc

        // common.js which is basically the client side cannot access this user info, can pass the payload but becomes empty after page is rendered
        // hence store in a var in pug page and then use in client side as well
        userLoggedInJs: JSON.stringify(req.session.user) // client will use this
        // to pass data b/w pages need to convert them to string
    }

    // res.status(200).send("Yahoo!") // successful
    res.status(200).render("home", payload) // takes 2 parameters: what page we want to render and data that we want to send
})

// payload is basically the data we are sending to a function or a page or through request.