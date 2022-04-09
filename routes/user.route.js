const express = require('express')

const controller = require('../controllers/user.controller')
const { getInCheckout } = require('../controllers/cart.controller')


const router = express.Router()

router.get('/my/information', controller.viewMyAccount)
router.get('/my/user', controller.viewChangePassword)
router.get('/my/order/:id', controller.viewMyOrder)
router.get('/my/order/:id/cancel', controller.cancelOrder)
router.get('/my/checkout', getInCheckout , controller.viewMyCheckout)
router.get('/my/cart', getInCheckout ,controller.viewShoppingCart)

router.post('/change-password', controller.changePassword)
router.post('/update', controller.updateInfo)
module.exports = router;