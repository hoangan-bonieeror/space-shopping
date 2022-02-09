const express = require('express')

const controller = require('../controllers/user.controller')
const upload = require('../utils/upload')


const router = express.Router()

router.get('/product', controller.viewProductPage)
router.get('/order', controller.viewOrderPage)
router.get('/user', controller.viewUserPage)
router.get('/product/create', controller.viewCreateProduct)
router.post('/product/create', upload ,controller.postProduct)

module.exports = router;