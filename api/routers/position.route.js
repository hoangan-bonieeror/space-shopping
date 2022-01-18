const express = require('express')

const controller = require('../controllers/position.controller')

const router = express.Router()

router.get('/selection', controller.getAllPosition)

module.exports = router;