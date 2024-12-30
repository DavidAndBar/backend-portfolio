const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        max: 1024
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // minlength and min have the same function, they states what is the min length of the property. But
                     // you can still add information below min value using "min", minlength is more restrictive. 
    }
})

const User = mongoose.model('users', userSchema);

module.exports = User;