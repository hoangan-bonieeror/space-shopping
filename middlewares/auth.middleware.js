// var express = require('express')
// const fs = require('fs')
// var text = fs.readFileSync('./views/login/user.json',{ encoding : 'utf8'});
// var users = JSON.parse(text)



const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports.requireAuth = async function(req,res,next) {
	// console.log(req.app.locals.user)
	if(req.cookies.token) {
		let token = req.cookies.token

		let isExpired = false
		jwt.verify(token, process.env.SECRET_KEY , (err, decoded)=> {
			if(err) {
				isExpired = true

				res.app.locals.users.forEach(user => {
					if(parseInt(user.id) === parseInt(req.cookies.id)) {
						user = undefined
					}
				})

				res
				.clearCookie('token')
				.clearCookie('id')
			}
		})

		if(isExpired) {
			return res.redirect('/login')
		}

		let body = { token : token }
		let data = await fetch(process.env.ROOT_API_PATH + 'get-user-by-token' , {
			method : 'POST',
			body : JSON.stringify(body),
			headers : { 'Content-Type' : 'application/json' }
		})
	
		let response = await data.json()
	
	
		if(response.code === 400) {
			res.locals.message = response.message
			return next()
		}
	
		let user = response.data
	
		if(user) {
			user['createdAt'] = new Date(user['createdAt'])
			user['createdAt'] = user['createdAt'].toLocaleString()
			res.locals.currentUser = user
		}	
	} else {
		res.locals.isLogin = false
	}

	next()
}

module.exports.requireAuth_forAdmin = async function(req,res,next) {
	if(!req.cookies.token) {
		res.redirect('/login');
		return;
	}
	let token = req.cookies.token
	console.log(token)

	let body = { token : token }
	let data = await fetch(process.env.ROOT_API_PATH + 'get-user-by-token' , {
		method : 'POST',
		body : JSON.stringify(body),
		headers : { 'Content-Type' : 'application/json' }
	})

	let response = await data.json()

	let user = response.data

	if(user.is_admin === true) {
		res.locals.user = user.firstname + ' ' + user.lastname
		next()
	}
}

module.exports.handleMessage = (req,res, next) => {
	try {
		if(req.app.locals.existMessage) {
			res.locals.existMessage = req.app.locals.existMessage
			delete res.app.locals['existMessage']
		}
		next()
	} catch(err) {
		console.log(err)
	}
}

