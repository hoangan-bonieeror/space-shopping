const fs = require('fs')
const express = require('express')
const app = express();
const bcrypt = require('bcrypt');
const User = require('../model/user.model');
const Staff = require('../model/staff.model');


app.use(express.json()) // for parsing application/json

const ValidateEmail = (mail) =>  {
	var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if(mail.match(mailformat)) {
		return "Valid email address!";
	}
	else {
		return "You have entered an invalid email address!";
		 }
}

module.exports.register = function (req,res) {
	const {name,username, password} = req.body;
	// Check empty fields
	if(!username || !password || !name) {
		res.json({
			code : 400,
			status : 'Bad Request',
			message : "Please fill all fields"
		})
	} else {
		// Validation Email format
		check_mail = ValidateEmail(username);
		if (check_mail !== "Valid email address!") {
			return res.json({
				code : 400,
				status : 'Bad Request',
				message : check_mail
			})
		} else {
			
		}
	} 
}

module.exports.deleteUser = function(req,res) {
	var userId = req.params.id;
	
	User.getUserById(userId, (err, result)=> {
		if(err) {
			throw err;
		} else {
			if(result.length !== 0) {
				User.delete(userId, (err, result)=> {
					if(err) {
						console.log(err);
					} else {
						res.json({message : 'Delete Successfully'})
						.status('200')
					}
				})			
			} else {
				res
				.status(404)
				.json({message : 'User ID not found'})
			}
		}
	})
}

module.exports.getAllUsers = function(req,res) {
	User.getAllUsers(function(err, users) {
		if(err) {
			console.log(err)
		} else {
			res.send({users : users})
		}
	 });
}

module.exports.getUserById= (req,res) => {
	User.getUserById(req.params.id, (err, user)=> {
		if(err) throw err ;
		res.json({user})
		.status(200)
	})
}