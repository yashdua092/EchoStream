const mongoose = require('mongoose') // returns the same instance from the database.js, so already connected to database

// schema represents the predefined structure and validation rules for documents(data) in a collection
const Schema = mongoose.Schema // would be a type

const PostSchema = new Schema({ // 2 parameters: data and some other options
    content: {
        type: String,
        trim: true
    },

    postedBy: {
        type: Schema.Types.ObjectId, // user will have a objectid who is currently in session, mongoose
        // will populatye or rather provide a reference to that document(object) using this
        ref: 'User', // User collection, to estbalish a relationship
        pinned: Boolean,
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }] // will contain all the users that like this post
    }
 
}, { timestamps: true}) // timestamps helps to get created at and updated at property
// all these properties will be accessible for that particular user as in loginRoutes.js file

var Post = mongoose.model('Post', PostSchema) //  takes two arguments: the name of the model (which is 'User' in this case) and the schema to be used for the model.
module.exports = Post // user model is exported.



/* 

Here's what mongoose.model() does:

Defines a Model: When calling mongoose.model(), you pass in two arguments: the name of the model and the schema definition. The function creates a model object that represents a MongoDB collection and associates it with the specified schema.

Collection Name: The name you provide when creating a model determines the name of the MongoDB collection associated with that model. By convention, the model name is typically singular and capitalized (e.g., 'User'), and Mongoose will automatically pluralize it to create the corresponding collection name ('users' in this case).

CRUD Operations: The model object returned by mongoose.model() provides an interface to perform Create, Read, Update, and Delete (CRUD) operations on the associated collection. You can use methods like create(), find(), findOne(), updateOne(), deleteOne(), etc., to interact with the collection and perform operations on the documents.

Data Validation: The model also incorporates the validation rules defined in the schema. When performing operations like inserting or updating documents, Mongoose automatically validates the data based on the schema definition, ensuring that the data meets the specified validation rules before it is saved to the database.

Middleware and Hooks: Mongoose models allow you to define pre and post middleware functions (also known as hooks) that execute before or after certain operations on the documents. These hooks provide a way to add custom logic or perform additional tasks during various stages of document manipulation.

*/