const express = require('express')
const app = express()
const port = 3000

// takes in 2 parameters: port no. where listening and code that fires when listening.
const server = app.listen(port, () => console.log("server listening on port 3000"))

app.set("view engine", "pug")
app.set("views", "views") // when need a template go to the folder 'views'

app.get("/", (req, res, next) => {

    var payload = {
        pageTitle: "Hola"
    }

    // res.status(200).send("Yahoo!") // successful
    res.status(200).render("home", payload) // takes 2 parameters: what page we want to render and data that we want to send
})

// payload is basically the data we are sending to a function or a page or through request.