const express = require('express')

const controller = require('../controllers/user.controller')
const upload = require('../utils/upload')


const router = express.Router()

router.get('/product', controller.viewProductPage)
router.get('/product/create', controller.viewCreateProduct)
router.post('/product/create', upload ,controller.postProduct)
router.get('/product/search', controller.filterProduct)
router.get('/product/:id_product', controller.viewDetailProduct)
router.post('/product/update/:id', controller.putProduct)
router.get('/order', controller.viewOrderPage)
router.get('/user', controller.viewUserPage)
router.get('/brand', controller.viewBrandPage)
router.get('/brand/search', controller.searchBrand)
router.get('/category', controller.viewCategoryPage)
router.get('/category/search', controller.searchCategory)
router.post('/brand/add', controller.postBrand)
router.post('/brand/update/:id', controller.putBrand)
router.get('/brand/delete/:id', controller.deleteBrand)
router.post('/category/add', controller.postCategory)
router.post('/category/update/:id', controller.putCategory)
router.get('/category/delete/:id', controller.deleteCategory)
router.get('/user/create', controller.viewCreateUser)

module.exports = router;