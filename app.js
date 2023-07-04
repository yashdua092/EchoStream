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
    saveUninitialized: false // don't save if not set 
}))

// Routes
const loginRoute = require('./routes/loginRoutes')
const registerRoute = require('./routes/registerRoutes')

// app.use() is used to setup middleware for the application.
// from main page to different pages basically.
app.use("/login", loginRoute) // after returning from middleware, need to get the user to login if not registered. this is where it will go from.
app.use("/register", registerRoute)

app.get("/", middleware.requireLogin, (req, res, next) => {
// this function tackles what happens when user request the root of the site.(home page)
    var payload = {
        pageTitle: "Hola",
        userLoggedIn: req.session.user
    }

    // res.status(200).send("Yahoo!") // successful
    res.status(200).render("home", payload) // takes 2 parameters: what page we want to render and data that we want to send
})

// payload is basically the data we are sending to a function or a page or through request.