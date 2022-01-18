const express = require('express')
const controller = require('../controllers/material.controller')

const router = express.Router()

router.get('/all', controller.getAllMaterial)
router.get('/create', function(req,res) {
	res.render('material/create');
})
router.post('/create', controller.addMaterial)

module.exports = router;