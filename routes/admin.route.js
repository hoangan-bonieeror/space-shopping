const express = require('express')

const controller = require('../controllers/user.controller')
const upload = require('../utils/upload')


const router = express.Router()

router.get('/product', controller.viewProductPage)
router.get('/product/create', controller.viewCreateProduct)
router.post('/product/create', upload ,controller.postProduct)
router.get('/product/:id_product', controller.viewDetailProduct)
router.get('/order', controller.viewOrderPage)
router.get('/user', controller.viewUserPage)
router.post('/product/update/:id', controller.putProduct)
router.get('/brand', controller.viewBrandPage)
router.get('/category', controller.viewCategoryPage)

module.exports = router;