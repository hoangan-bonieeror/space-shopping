// Authentication
const fs = require('fs')
const express = require('express')
const app = express();

app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

module.exports.logout = function(req,res) {
	res
	.clearCookie('token')
	.clearCookie('id')
	
	res.redirect('/')
};