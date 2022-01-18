const express = require('express')

const controller = require('../controllers/cart.controller')
const router = express.Router()

router.post('/add-to-cart/:id_product/:quantity', controller.addToCart)
router.post('/order', controller.checkout)

module.exports = router;