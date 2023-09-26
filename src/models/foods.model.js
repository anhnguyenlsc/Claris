const mongoose = require('mongoose');
const Food = require('../models/foods.model')

const foodSchema = new mongoose.Schema({
    title: { type: String, required: true },
    foodCode: { type: String, required: true },
    description: { type: String, required: true },
    ImageUrl: { type: String, required: true },
    price: { type: String, required: false } 
})

module.exports = mongoose.model('Food', foodSchema)