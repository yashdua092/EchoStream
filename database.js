const mongoose = require('mongoose') // require returns a singleton object ie that instance is used in the whole application.
// mongoose.set('useNewUrlParser', true)
// mongoose.set('useUnifiedTopology', true)
// mongoose.set('useFindAndModify', false)

class Database {

    constructor() {
        this.connect()
    }


    connect() {
        mongoose.connect("mongodb+srv://yash:Student11@socialcluster.yqwdi1w.mongodb.net/?retryWrites=true&w=majority") // returns a promise which means we can add callbacks to it.
        .then(() => {
            console.log("database connection succesful")
        }) // if connection successful will run what inside then
        .catch((err) => {
            console.log("database connection error" + err)
        }) // else will try to catch the error
    }
}

module.exports = new Database() // exporting instance of Database class