const express = require('express')

const controller = require('../controllers/register.controller')


const router = express.Router()

router.get('/register', controller.viewUser)
router.post('/register', controller.register)
router.get('/delete', controller.deleteUser)

module.exports = router;