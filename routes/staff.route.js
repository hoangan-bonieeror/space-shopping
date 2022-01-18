const express = require('express')

const controller = require('../controllers/staff.controller')

const router = express.Router()
router.get('/', controller.viewStaff);
router.get('/create', controller.viewFormCreate)
router.post('/create', controller.createStaff) 
router.get('/search',  controller.searchStaff)
router.get('/delete', controller.deleteStaff)
router.get('/filter', controller.filterByPosition)

module.exports = router;