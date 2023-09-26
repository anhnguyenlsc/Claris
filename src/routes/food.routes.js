const express = require("express")
const router = express.Router()
const Food = require('../models/foods.model')
var cloudinary = require('cloudinary').v2;
const upload = require('../handlers/upload.multer')

cloudinary.config({
    cloud_name: 'dzgdczkjk',
    api_key: '451129743528376',
    api_secret: 'CLrQi7kqM7DPrA5qmDbBkhNbk7E'
  });

// Add Food - get
router.get('/new', async(req, res, next) => {
    try {
        const food = new Food()
        res.render('foods/new', {
            food: food
          })
    } 
    catch (error) {
        res.redirect('/foods')
    }
  });

// Add Food - post
router.post('/', upload.single('ImageUrl'), async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path)
    const food = new Food({
        title: req.body.title,
        foodCode: req.body.foodCode,
        description: req.body.description,
        ImageUrl: result.secure_url,
        price: req.body.price
    })

    const foodCheckid = await Food.findOne({
        foodCode: req.body.foodCode
     })

    const foodCheckname = await Food.findOne({
        title: req.body.title
     })
    
     
  // Nếu tìm thấy id trùng nhau sẽ render ra mess
  if (foodCheckid) {
    return res.render('foods/new', {
        food: food,
        errorMessage: 'Food Already Exists'
    })
  }

  else if (foodCheckname) {
    return res.render('foods/new', {
        food: food,
        errorMessage: 'Food Already Exists'
    })
  }
        
    try {
        const newFood = await food.save()
        res.redirect('/foods')
        
    } 
    catch (error) {
        res.render('/foods/new', {
            food: food,
            errorMessage: 'Error Creating Food'
        })
    }

});

// Hiển thị trang Food List
router.get('/', async (req, res, next) => {
    let searchOptions = {}
    if (req.query.title != null && req.query.title !==''){
      searchOptions.title = new RegExp(req.query.title, 'i')
      // 'i' ở đây có nghĩa là tìm kiếm tên mà không phần biệt chữ hoa hay thường
    }
    try{
      const foods = await Food.find(searchOptions);
      res.render('foods/index',{
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
       // tìm food dựa vào id
        const food = await Food.findById(req.params.id).exec()
        res.render('foods/detail', {
            food: food
        })
    } catch {
        res.redirect('/')
    }
})

// Chuyển sang trang cập nhật thông tin món ăn
router.get('/:id/edit', async (req, res, next) => {
    try {
        // Tìm food trong database dựa vào id
        const food = await Food.findById(req.params.id) 

       // Truyền dữ liệu của food vào views để định nghĩa và render được nó ra trong view
        res.render('foods/edit', {
            food: food
        })
    } 
    // Nếu lỗi thì chạy lại trang Food List
    catch {
        res.redirect('/foods')
    }
})

// Cập nhật thông tin món ăn - put
router.put('/:id', upload.single('ImageUrl'), async (req, res, next) => {
    const result = await cloudinary.uploader.upload(req.file.path)
    let food
    
        food = await Food.findById(req.params.id) 
                food.title = req.body.title,
                food.foodCode =req.body.foodCode,
                food.description = req.body.description,
                food.ImageUrl = result.secure_url,
                food.price = req.price
            await food.save()

            res.redirect('/foods')
    // try {
    //     // Tìm food dựa vào id và cập nhật lại thông tin food đó
    //     food = await Food.findById(req.params.id) 
    //         food.title = req.body.title,
    //         food.foodCode =req.body.foodCode,
    //         food.description = req.body.description,
    //         food.ImageUrl = result.secure_url,
    //         food.price = req.price
    //     await food.save()

    //     res.redirect('/foods')

    // } catch {
    //     res.render('foods/edit', {
    //         food: food,
    //         errorMessage: 'Error Updating Food'
    //     })
    // }
})

// Xoá món ăn
router.delete('/:id', async (req, res, next) => {
    let food
    try {
        //Tìm food dựa vào id
        food = await Food.findById(req.params.id) 
        await food.remove() // Xóa food trong database
        res.redirect('/foods')// Nếu xoá thành công thì chuyển sang trang Food List
    } 
    catch {
          res.redirect(`/foods/${food.id}`)
    }
})

module.exports = router