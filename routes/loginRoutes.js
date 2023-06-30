const express = require('express')
const app = express()
const router = express.Router()

app.set("view engine", "pug")
app.set("views", "views") // when need a template go to the folder 'views'

// router will handle the request here not app
// Handler for the /login route(get request)
router.get("/", (req, res, next) => {
    res.status(200).render("login") // if user requests the home page and not signed in, login page should be rendered.
})

module.exports = router