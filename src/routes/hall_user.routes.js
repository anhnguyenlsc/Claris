const express = require("express")
const router = express.Router()
const Hall = require('../models/hall.model')


// GET trang Hall List User
router.get('/hall_list_user', async (req, res, next) => {
    let searchOptions = {}
    if (req.query.hallname != null && req.query.hallname !==''){
      searchOptions.hallname = new RegExp(req.query.hallname, 'i')
      // 'i' ở đây có nghĩa là tìm kiếm tên mà không phần biệt chữ hoa hay thường
    }
    try{
      const halls = await Hall.find(searchOptions);
      res.render('hall_user/hall_list_user',{
        halls: halls,
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
        const hall = await Hall.findById(req.params.id).exec()
        res.render('hall_user/hall_detail', {
            hall: hall
        })
    } catch {
        res.redirect('/')
    }
})

module.exports = router