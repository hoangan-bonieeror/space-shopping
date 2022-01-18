const express = require('express')

const controller = require('../controllers/register.controller')


const router = express.Router()

router.post('/register', controller.register)
router.get('/', controller.getAllUsers)
router.get('/:id', controller.getUserById)
router.delete('/delete/:id', controller.deleteUser)

module.exports = router;