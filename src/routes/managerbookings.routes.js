const express = require("express")
const router = express.Router()
const Booking = require('../models/bookings.model')

router.get('/managerbookings', async (req, res) => {
  let query = Booking.find()

    try{
      const bookings = await query.exec();
      const booking = new Booking();
      res.render('bookings/managerbookings',{
        booking: booking,
        bookings: bookings
      })
  
    }
    catch{
      res.redirect('/')
    }
  
  });

module.exports = router