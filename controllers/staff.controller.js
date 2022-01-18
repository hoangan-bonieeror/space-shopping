const fs = require('fs')
const express = require('express')
const app = express();
const text = fs.readFileSync('./data.json',{ encoding : 'utf8'});
const staff = JSON.parse(text)

const fetch = require('node-fetch');

app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


module.exports.viewStaff = async (req,res) => {
	// body...
	let data = await fetch('http://localhost:3100/api/staff', {method : "GET"})
	let staffList = await data.json()

	return res.render('staff/index', {
		staffs : staffList.data});
};

module.exports.viewFormCreate = async (req,res) => {
	let data_shift = await fetch('http://localhost:3100/api/shift/selection', {method : "GET"})
	let shiftList = await data_shift.json()

	let data_position = await fetch('http://localhost:3100/api/position/selection', {method : "GET"})
	let positionList = await data_position.json()

	return res.render('staff/create', {
		shifts : shiftList.data,
		positions : positionList.data
	});
}

module.exports.createStaff = async (req,res) => {
	try {

		let body = {firstname : firstname,
			 lastname : lastname,
			 phone : phone,
			 address : address,
			 id_shift : id_shift,
			 id_position : id_position } = req.body

		let response = await fetch('http://localhost:3100/api/staff/create', {
			method : "POST",
			body : JSON.stringify(body),
			headers : {'Content-Type': 'application/json'}		
		})

		response = await response.json()
	
		if(response.code === 400 || response.code === 500) {
			let data_shift = await fetch('http://localhost:3100/api/shift/selection', {method : "GET"})
			let shiftList = await data_shift.json()
		
			let data_position = await fetch('http://localhost:3100/api/position/selection', {method : "GET"})
			let positionList = await data_position.json()
		
			return res.render('staff/create', {
				error : response.message,
				shifts : shiftList.data,
				positions : positionList.data
			})
		}
		res.redirect('/staff')
	} catch (err) {
		console.log(err)
	}
};


module.exports.searchStaff = function(req,res) {
 	var key = req.query.key;
	var matchedStaff = staff.filter(function(staff){
		return staff.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
	})
	res.render('staff/index',{
		staffs :  matchedStaff,
		values : req.query
	})
 }

module.exports.deleteStaff = function(req,res) {
	var name = req.query.name;
	for( var i = 0; i < staff.length; i++){ 
    
        if ( staff[i].name === name) { 
            staff.splice(i, 1); 
        }
    }
    try {
		fs.writeFileSync('./data.json', JSON.stringify(staff, null, 2), 'utf8');
		console.log("The file was saved!");
	}
	catch(err) {
		console.err("An error has ocurred when saving the file.");
	}
	res.redirect('/staff');
}

module.exports.filterByPosition = (req,res) => {
	if (req.query.position) {
		var key = req.query.position;
		var matchedStaff = staff.filter(function(staff){
			return staff.position == key;
		})
	} else { var matchedStaff=staff; }
	if(req.query.dob) {
		matchedStaff = matchedStaff.filter(function(matchedStaff){
			var date = matchedStaff.date.split('-')
			var year = date[0]
			return year == req.query.dob;
		})
	}

	res.render('staff/index',{
		staffs :  matchedStaff,
		values : req.body
	})
}