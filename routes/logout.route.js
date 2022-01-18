const express = require('express')
const controller = require('../controllers/logout.controller')
const router = express.Router()

router.get('/logout', controller.logout)

module.exports = router;