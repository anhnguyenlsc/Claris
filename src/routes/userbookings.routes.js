const express = require("express")
const router = express.Router()
const Booking = require('../models/bookings.model')
var cloudinary = require('cloudinary').v2;
const upload = require('../handlers/upload.multer')


// Add userbooking - get
router.get('/userbooking', async(req, res, next) => {
    try {
        const booking = new Booking()
        res.render('userbookings/userbooking', {
            booking: booking
          })
    } 
    catch (error) {
        res.redirect('/userbookings')
        
    }
  });

// Add userbooking - post
router.post('/', upload.single('ImageUrl'), async (req, res) => {
    const booking = new Booking({
        fullname: req.body.fullname,
        email: req.body.email,
        halltype: req.body.halltype,
        foodtype: req.body.foodtype,
        phone: req.body.phone,
        bookingDate: req.body.bookingDate
    })
    
    const bookingDateCheck = await Booking.findOne({
      bookingDate: req.body.bookingDate
   })

// Nếu tìm thấy id trùng nhau sẽ render ra mess
if (bookingDateCheck) {
  return res.render('userbookings/userbooking', {
      booking: booking,
    errorMessage: 'Date is already choosen. Please choose another date.'
  })
}

        
    try {
        const newBooking = await booking.save()
        res.redirect('/userbookings')
    } 
    catch (error) {
        // res.render('user', {
        //     booking: booking,
        //     errorMessage: 'Booking Failed'
        //)
    }

});


router.get('/', async(req, res, next) => {
  let query = Booking.find()

  const bookings = await query.exec()
  res.render('bookingsuccess',{
    bookings: bookings,
  })
})



module.exports = router