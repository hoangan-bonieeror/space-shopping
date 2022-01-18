const express = require('express')
const controller = require('../controllers/staff.controller')

const router = express.Router()

router.post('/create', controller.createStaff) 
router.post('/search', controller.searchStaff)
router.delete('/delete/:id', controller.deleteStaff)
router.get('/', controller.viewStaff)
router.get('/:id', controller.getInforStaff)
router.put('/update/:id', controller.updateStaff)

module.exports = router;