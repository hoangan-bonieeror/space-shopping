const express = require('express')

const controller = require('../controllers/product.controller')


const router = express.Router()

router.get('/all', controller.getAllProduct)
router.get('/filter', controller.filterProduct)
router.post('/active', controller.activeProduct)
router.get('/:id_product', controller.viewDetailProduct)


module.exports = router;