const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Image Schema
const ImageSchema = new Schema({
    image: { 
        type: Buffer
    },
    contentType: {
        type: String
    },
    uploaded: {
        type: Date,
        default: Date.now
    }
})


module.exports = Image = mongoose.model('images', ImageSchema)

