const mongoose = require('mongoose')
const Schema = mongoose.Schema;


// Create Schema
const UserSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    },
    facebookId: {
        type: String
    },
    email: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    isBuyer: {
        type: Boolean,
        default: false
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    isCourier: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = User = mongoose.model('users', UserSchema)