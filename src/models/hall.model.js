const mongoose = require('mongoose');
const Hall = require('../models/hall.model')

const hallSchema = new mongoose.Schema({
    hallid: { type: String, required: true },
    hallname: { type: String, required: true },
    halltype: { type: String, required: true },
    price: { type: String, required: false },
    description: { type: String, required: true },
    ImageUrl: { type: String, required: true }
})

module.exports = mongoose.model('Hall', hallSchema)