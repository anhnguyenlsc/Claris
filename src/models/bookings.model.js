const mongoose = require('mongoose');
const Booking = require('../models/bookings.model')

const bookingSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    halltype: { type: String, required: true },
    foodtype: { type: String, required: false },
    phone: { type: String, required: false },
    bookingDate: { type: String, required: true }
})

module.exports = mongoose.model('Booking', bookingSchema)