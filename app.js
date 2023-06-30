const express = require('express')
const app = express()
const port = 3000
const middleware = require('./middleware')
const path = require('path') // path module

// takes in 2 parameters: port no. where listening and code that fires when listening.
const server = app.listen(port, () => console.log("server listening on port 3000"))

app.set("view engine", "pug")
app.set("views", "views") // when need a template go to the folder 'views'

// app.use(express.static("public")) //public folder contains all static files that need not to be processed by server
app.use(express.static(path.join(__dirname, "public")))

// Routes
const loginRoute = require('./routes/loginRoutes')
const registerRoute = require('./routes/registerRoutes')

// app.use() is used to setup middleware for the application.
app.use("/login", loginRoute) // after returning from middleware, need to get the user to login if not registered. this is where it will go from
app.use("/register", registerRoute)

app.get("/", middleware.requireLogin, (req, res, next) => {
// this function tackles what happens when user request the root of the site.(home page)
    var payload = {
        pageTitle: "Hola"
    }

    // res.status(200).send("Yahoo!") // successful
    res.status(200).render("home", payload) // takes 2 parameters: what page we want to render and data that we want to send
})

// payload is basically the data we are sending to a function or a page or through request.