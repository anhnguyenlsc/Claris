const express = require("express")
const router = express.Router()
const Hall = require('../models/hall.model')
var cloudinary = require('cloudinary').v2;
const upload = require('../handlers/upload.multer')

cloudinary.config({
    cloud_name: 'dzgdczkjk',
    api_key: '451129743528376',
    api_secret: 'CLrQi7kqM7DPrA5qmDbBkhNbk7E'
  });

// Add Hall - get
router.get('/new', async(req, res, next) => {
    try {
        const hall = new Hall()
        res.render('hall/new', {
            hall: hall
          })
    } 
    catch (error) {
        res.redirect('/hall')
    }
  });

// Add Hall - post
router.post('/', upload.single('ImageUrl'), async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path)
    const hall = new Hall({
        hallid: req.body.hallid,
        hallname: req.body.hallname,
        halltype: req.body.halltype,
        price: req.body.price,
        description: req.body.description,
        ImageUrl: result.secure_url
    })

    const hallCheckid = await Hall.findOne({
        hallid: req.body.hallid
     })

    const hallCheckname = await Hall.findOne({
        hallname: req.body.hallname
     })

  // Nếu tìm thấy id trùng nhau sẽ render ra mess
  if (hallCheckid) {
    return res.render('hall/new', {
        hall: hall,
      errorMessage: 'Hall Already Exists'
    })
  }

  else if (hallCheckname) {
    return res.render('hall/new', {
        hall: hall,
      errorMessage: 'Hall Already Exists'
    })
  }

    try {
        const newHall = await hall.save()
        res.redirect('/hall')
        
    } 
    catch (error) {
        res.render('/hall/new', {
            hall: hall,
            errorMessage: 'Error Creating Hall'
        })
    }

});

// Hiển thị trang Hall List
router.get('/', async (req, res, next) => {
    let searchOptions = {}
    if (req.query.hallname != null && req.query.hallname !==''){
      searchOptions.hallname = new RegExp(req.query.hallname, 'i')
      // 'i' ở đây có nghĩa là tìm kiếm tên mà không phần biệt chữ hoa hay thường
    }
    try{
      const halls = await Hall.find(searchOptions);
      res.render('hall/index',{
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
        res.render('hall/detail', {
            hall: hall
        })
    } catch {
        res.redirect('/')
    }
})

// Chuyển sang trang cập nhật thông tin sảnh
router.get('/:id/edit', async (req, res, next) => {
    try {
        // Tìm hall trong database dựa vào id
        const hall = await Hall.findById(req.params.id) 

       // Truyền dữ liệu của food vào views để định nghĩa và render được nó ra trong view
        res.render('hall/edit', {
            hall: hall
        })
    } 
    // Nếu lỗi thì chạy lại trang Hall List
    catch {
        res.redirect('/hall')
    }
})

// Cập nhật thông tin sảnh- put
router.put('/:id', upload.single('ImageUrl'), async (req, res, next) => {
    const result = await cloudinary.uploader.upload(req.file.path)
    let hall
    
        hall = await Hall.findById(req.params.id) 
                hall.hallid = req.body.hallid,
                hall.hallname =req.body.hallname,
                hall.halltype =req.body.halltype,
                hall.price = req.price,
                hall.description = req.body.description,
                hall.ImageUrl = result.secure_url
            await hall.save()

            res.redirect('/hall')
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

// Xoá sảnh
router.delete('/:id', async (req, res, next) => {
    let hall
    try {
        //Tìm hall dựa vào id
        hall = await Hall.findById(req.params.id) 
        await hall.remove() // Xóa hall trong database
        res.redirect('/hall')// Nếu xoá thành công thì chuyển sang trang Hall List
    } 
    catch {
          res.redirect(`/hall/${hall.id}`)
    }
})

module.exports = router