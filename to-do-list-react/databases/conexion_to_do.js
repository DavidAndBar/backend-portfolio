const mongoose = require('mongoose');

const USERNAME = process.env.DB_USER_TODO;
const PASSWORD = process.env.DB_PASSWORD_TODO;
const DB_NAME = process.env.DB_NAME

const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster.hjyp6wt.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster`;

mongoose.connect(uri) // useNew... and useUni... are optional parameters, 
                                                                        // connection still works without them
.then( () => {
    console.log("DB connected")
} )
.catch( (error) => console.log("error"));
