const express = require('express');
const router = express.Router();
const Admin = require('../models/admin.model')


// GET Trang Chủ User khi vào trang web
router.get('/', async(req, res, next) => {
    res.render('user', {
    })
})


// GET Trang Chủ Manager khi bấm vào Home, Logo
router.get('/index', async(req, res, next) => {
    res.render('index', {
    })
})


// GET Sign In Page
router.get('/login', function(req, res, next) {
    res.render('login', {})
})
  

// POST Sign In Page
router.post('/index', async (req, res) => {
    const admin = new Admin({ 
        username: req.body.username,
        password: req.body.password
     })

    const checkusername = await Admin.findOne({ 
        username: req.body.username 
    })

    const checkpassword = await Admin.findOne({
        password: req.body.password
    })

    if (checkusername && checkpassword) {
        res.render('index')
    }
    else {
        res.render('login')
    }
   
})



module.exports = router