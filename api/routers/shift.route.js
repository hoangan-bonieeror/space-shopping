const express = require('express')

const controller = require('../controllers/shift.controller')

const router = express.Router()

router.get('/selection', controller.getAllShift)

module.exports = router;