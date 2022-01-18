// Authentication
// var text = fs.readFileSync('./views/login/user.json',{ encoding : 'utf8'});
// var users = JSON.parse(text)
const fetch = require('node-fetch');
require('dotenv').config()

module.exports.login = function(req,res) {
	res.render('./login/login')
}
// module.exports.postLogin = function(req,res) {
// 	var username = req.body.user;
// 	var pwd = req.body.password;
// 	var errors = ""
// 	var user = [];
// 	if(!username) {res.render('login/login', {
// 		errors : ['Please enter username']
// 		});
// 	return ;
// 	}

// 	for(each of users) {
// 		if(each.username === username) {
// 			user.username = username;
// 			if(each.password === pwd) {
// 				user.password = pwd;
// 			} 
// 		} 
// 	}
// 	if(!user.username) {res.render('./login/login', {
// 		errors : ['User does not exist']
// 	})}

// 	else if(!user.password) {res.render('./login/login', {
// 		errors : ['Wrong Password']
// 	})}	

// 	// res.cookie('user', username)
// 	res
//   		.status(201)
//   		.cookie('user', username, {
//     		expires: new Date(Date.now() + 8 * 3600000),
//     		httpOnly: true  // cookie will be removed after 8 hours
//   		})
//   		.redirect(301, '/')
// }

module.exports.postLogin = async (req,res) => {
	try {
		let body = { email : email , password : password } = req.body

		let data = await fetch(process.env.ROOT_API_PATH + 'login' , {
			method : 'POST',
			body : JSON.stringify(body),
			headers : { 'Content-Type' : 'application/json' }
		})

		let response = await data.json()

		if(response.code === 400 || response.code === 500) {
			return res.render('login/login', {
				error : response.message
			})
		}

		// return res
		// .header('token', response.token)
		// .redirect('/')

		let bodyUser = { token : response.token }

		let dataUser = await fetch(process.env.ROOT_API_PATH + 'get-user-by-token', {
			method : 'POST',
			body : JSON.stringify(bodyUser),
			headers : {'Content-Type' : 'application/json'}
		})
		let responseUser = await dataUser.json()

		if(responseUser.code === 200) {
			if(responseUser.data.isadmin) {
				return res
				.cookie('token', response.token)
				.redirect('/admin/product')
			} else {
				res.app.locals.users.push({
					id : responseUser.data.id,
					cart : []
				})

				if(res.app.locals.message) {
					res.app.locals.message = undefined
				}

				res
				.cookie('token', response.token)
				.cookie('id', responseUser.data.id, {
					httpOnly : true
				})
				.redirect('/')
			}
		}
	} catch(err) {
		console.log(err)
	}
}