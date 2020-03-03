const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    typeOfProduct: {
        type: String,
        enum: ['fruit', 'vegetable']
    },
    imageId: {
        type: Schema.Types.ObjectId,
        ref: 'images',
    },
    description: {
        type: String,
        required: true
    },
    bidders: [{
        userid: {
            type : Schema.Types.ObjectId,
            ref: 'users'
        },
        bidPrice: {
            type: Number
        }
    }],
    basePrice: {
        type: Number
    },
    available: {
        type: Boolean,
        required: true
    },
    publishedDate: {
        type: Date,
        default: Date.now
    },
    timeDuration: {
        type: Date,
        default: new Date(+new Date() + 24 * 60 * 60 * 1000)
    },
    unit: {
        type: Number,
        default: 100
    }
});


ProductSchema.index({
  name: 'text',
  description: 'text',
}, {
  weights: {
    name: 5,
    description: 1,
  },
});

module.exports = Product = mongoose.model('products', ProductSchema)