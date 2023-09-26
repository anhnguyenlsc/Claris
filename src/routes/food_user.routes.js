const express = require("express")
const router = express.Router()
const Food = require('../models/foods.model')
var cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dzgdczkjk',
    api_key: '451129743528376',
    api_secret: 'CLrQi7kqM7DPrA5qmDbBkhNbk7E'
  });


// Hiển thị trang Food List User
router.get('/food_list_user', async (req, res, next) => {
    let searchOptions = {}
    if (req.query.title != null && req.query.title !==''){
      searchOptions.title = new RegExp(req.query.title, 'i')
      // 'i' ở đây có nghĩa là tìm kiếm tên mà không phần biệt chữ hoa hay thường
    }
    try{
      const foods = await Food.find(searchOptions);
      res.render('foods_user/food_list_user',{
        foods: foods,
        searchOptions : req.query
      })
  
    }
    catch{
      res.redirect('/')
    }
  
});


// Chuyển sang trang Chi Tiết
router.get('/:id', async (req, res, next) => {
    try {
       // tìm hall dựa vào id
        const food = await Food.findById(req.params.id).exec()
        res.render('foods_user/food_detail', {
            food: food
        })
    } catch {
        res.redirect('/')
    }
})

module.exports = router