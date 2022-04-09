const express = require('express')

const controller = require('../controller/cart.controller')
const router = express.Router()

router.post('/add-to-cart/:id', controller.addToCart)
router.get('/user/:id/get-cart', controller.getCart)
router.get('/user/:id_user/cart/delete/:id_product', controller.deleteItem)
router.post('/user/:id_user/cart/update/:id_product', controller.updateQuantityItem)
module.exports = router;