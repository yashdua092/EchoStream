const mongoose = require('mongoose') // returns the same instance from the database.js, so already connected to database

// schema represents the predefined structure and validation rules for documents(data) in a collection
const Schema = mongoose.Schema // would be a type

const userSchema = new Schema({ // 2 parameters: data and some other options
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true, // could even do some processing here as well
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "/images/profilePic.png"
    }
}, { timestamps: true}) // timestamps helps to get created at and updated at property
// all these properties will be accessible for that particular user as in loginRoutes.js file

var user = mongoose.model('User', userSchema) //  takes two arguments: the name of the model (which is 'User' in this case) and the schema to be used for the model.
module.exports = user // user model is exported.