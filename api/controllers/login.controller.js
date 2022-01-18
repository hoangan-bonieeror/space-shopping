// Authentication
const express = require('express')
const app = express();
const bcrypt = require('bcrypt');
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');



app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

module.exports.authentication = async function(req,res) {
	var { username, password } = req.body;
	if(!username || !password) {
		return res.status(500).json({ message: 'Please fill all fields' })
	}

	var promise = new Promise((resolve,reject)=> {
		User.isExist(username, async (userMatch,result) => {
			if(result === false) {
				return res.status(500).json({ message: 'User does not exist' });
			} 
			resolve(userMatch);
		});
	});
	
	promise.then(async(userMatch)=> {
		const matchPassword = await bcrypt.compare(password, userMatch.password);
	
		if(matchPassword) {
			var token = jwt.sign(userMatch.id, process.env.SECRET_KEY);
			var at = new Date();
			var message = 'Login with ' + username + ' at ' + at;
			return res.json({
				message : message,
				token : token
			})
		} 
		return res.json({message : 'Wrong Password'})
	})
	.catch((error)=>{
		console.log(error)
	}) 
}




