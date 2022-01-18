const Staff = require('../model/staff.model');

function check_date_input(dateString) {
	try {
		var date = dateString.slice(0, dateString.indexOf("/"))
		var date2 = dateString.slice(dateString.indexOf("/") + 1)
		var year = date2.slice(date2.indexOf("/") + 1)
		var month = date2.slice(0, date2.indexOf("/"))
		var check;
		if (Number(date) > 31 || Number(date) < 1 || Number(month) > 12 || Number(month) < 1
			|| Number(year) > 2021 || year.length < 3 || year == '0000') {
			check = false;
		} else { check = true }
		return check;
	} catch (error) {
		console.error(error);
	}
}

const ValidatePhone = (phone) => {
	var phoneNum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
	if (!phone.match(phoneNum)) {
		return false
	} else {
		return true
	}
}


module.exports.viewStaff = function (req, res) {
	Staff.getAllStaffs((err, staffList) => {
		if (err) throw err;

		return res.json({
			code: 200,
			status: 'OK',
			data: staffList
		})
	})
};


module.exports.createStaff = function (req, res) {
	const { firstname, lastname, id_position, id_shift, datebirth, phone, address } = req.body;

	if (!firstname || !lastname || !datebirth || !id_position || !id_shift || !phone || !address) {
		return res.json({
			code: 400,
			status: 'Bad Request',
			message: 'Please fill all fields'
		})
	}

	const isDateValid = check_date_input(datebirth)
	if (isDateValid === false) {
		return res.json({
			code: 400,
			status: 'Bad Request',
			message: 'Invalid date format'
		})
	}

	if (!ValidatePhone(phone)) {
		return res.json({
			code: 400,
			status: 'Bad Request',
			message: 'Invalid phone format'
		})
	}

	Staff.isExist(firstname + ' ' + lastname, (result) => {
		if (result === true) {
			return res.json({
				code : 400,
				status : 'Bad Request',
				message: 'Staff is already in' })
		} else {
			const staff = new Staff({
				firstname: firstname,
				lastname: lastname,
				id_position: id_position,
				id_shift: id_shift,
				datebirth: datebirth,
				phone: phone,
				address: address
			})

			Staff.save(staff)
			return res.json({
				code: 200,
				status: 'OK',
				message: 'Successfully'
			})
		}
	})
};


module.exports.searchStaff = function (req, res) {
	let { key } = req.query;
	Staff.getAllStaffs((err, staffList) => {
		if (err) throw err;

		let matchedStaff = staffList.filter(function (staff) {
			return staff.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
		})

		return res.json({
			code: 200,
			status: 'OK',
			data: matchedStaff
		})
	})
}

module.exports.deleteStaff = function (req, res) {
	let staffId = req.params.id;

	Staff.getStaffById(staffId, (err, result) => {
		if (err) {
			throw err;
		} else {
			if (result.length !== 0) {
				Staff.delete(staffId, (err, result) => {
					if (err) {
						console.log(err);
					} else {
						return res.json({
							code: 200,
							status: 'OK',
							message: 'Delete Successfully'
						})
					}
				})
			} else {
				return res.json({
					code: 400,
					status: 'Bad Request',
					message: 'Staff ID not found'
				})
			}
		}
	})
}

module.exports.getInforStaff = function (req, res) {
	try {
		let staffId = req.params.id;
		Staff.getStaffById(staffId, (err, staff) => {
			if (err) throw err;
			else return res.json({
				code: 200,
				status: 'OK',
				data: staff
			})
		})
	} catch (err) {
		return res.json({
			code : 500,
			status : 'Internal Error',
			message : 'Something went wrong'
		})
	}
}

module.exports.updateStaff = function (req, res) {
	const staffId = req.params.id;

	const { name, position, shift, date } = req.body;

	if (!name || !date || !position || !shift) {
		return res.json({ message: 'Please fill all fields' })
	}

	const isDateValid = check_date_input(date)
	if (isDateValid === false) {
		return res.json({ message: 'Invalid date format' })
	}

	Staff.getStaffById(staffId, (err, result) => {
		if (err) throw err;
		if (result.length === 0) {
			return res.json({ message: 'Staff ID not found' }).status(404)
		} else {
			const staff = {
				name: name,
				position: position,
				shift: shift,
				date: date
			}

			Staff.update(staffId, staff, (err, result) => {
				if (err) throw err;
				console.log(result)
				return res.json({ message: 'Successfully' })
			})
		}
	})

}
