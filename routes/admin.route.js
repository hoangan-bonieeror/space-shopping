const express = require('express')

const controller = require('../controllers/user.controller')


const router = express.Router()

router.get('/product', controller.viewProductPage)
router.get('/order', controller.viewOrderPage)
router.get('/user', controller.viewUserPage)

module.exports = router;