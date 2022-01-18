const fetch = require('node-fetch')

require('dotenv').config()

module.exports.viewUser = async function(req,res) {
	let data = await fetch('https://provinces.open-api.vn/api/?depth=2', { method : 'GET' })

    let response = await data.json()

	return res.render('login/customer/register', {
		cityList : response
	})
}

module.exports.register = async (req,res) => {
	let body = { 
		firstname : firstname,
		lastname : lastname,
		address : address,
		city : city,
		mobile_phone : phone,
		company : company,
		email : email,
		password : password,
		re_password : re_password } = req.body

	let data = await fetch(process.env.ROOT_API_PATH + 'register' , {
		method : 'POST',
		body : JSON.stringify(body),
		headers : {'Content-Type' : 'application/json'}
	})

	let response = await data.json()

	console.log(response)

	if(response.code === 200) {
		return res.redirect('/login')
	} else {
		console.log(response)

		return res.render('login/customer/register', {
			error : response.message.join(' | ')
		})
	}
}

module.exports.deleteUser = function(req,res) {
	var username = req.query.username;
	for( var i = 0; i < users.length; i++){ 
        if ( users[i].username === username) { 
            users.splice(i, 1); 
        }
    }
    try {
		fs.writeFileSync('./views/login/user.json', JSON.stringify(users, null, 2), 'utf8');
		console.log("The file was saved!");
	}
	catch(err) {
		console.err("An error has ocurred when saving the file.");
	}

	res.redirect('/user');

}