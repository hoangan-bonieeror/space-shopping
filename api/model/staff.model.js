const db = require('../db') 
const shortid = require('shortid')

var Staff = function(staff) {
    this.id = shortid.generate();
    this.firstname = staff.firstname;
    this.lastname = staff.lastname
    this.id_position = staff.id_position;
    this.id_shift = staff.id_shift;
    this.phone = staff.phone
    this.address = staff.address
    this.datebirth = staff.datebirth
    this.status = false;
    this.createAt = new Date();
    this.id_user = null
}

const handleOutput = (staff) => {
    staff['position'] = {
        id : staff.id_position,
        poname : staff.poname,
        salary : staff.salary
    }

    delete staff.id_position
    delete staff.poname
    delete staff.salary

    staff['shift'] = {
        id : staff.id_shift,
        hourcount : staff.hourcount,
        shiftname : staff.shiftname,
        timework : staff.timework
    }

    delete staff.id_shift
    delete staff.hourcount
    delete staff.timework
    delete staff.shiftname
}

Staff.getAllStaffs = (result) => {
    const sql = 'SELECT staff.*,position.poname , position.salary , shift.hourcount, shift.shiftname, shift.timework FROM staff INNER JOIN position ON staff.id_position=position.id INNER JOIN shift ON staff.id_shift=shift.id';
    db.query(sql, (err, staffList)=> {
        if(err) {
            result(err, null);
        } else {
            staffList.forEach(staff => {
                handleOutput(staff)
            });
            result(null, staffList);
        }
    }) 
}

Staff.getStaffByName = (name, result) => {
    let [firstname, lastname] = name.split(' ')
    db.query(`SELECT * FROM staff WHERE firstname = '${firstname}' AND lastname ='${lastname}'`,
    async (err, res) => {
        if(err) {
            console.log(err)
            result(err, null);
        } else {
            // handleOutput(res[0])
            result(null,res[0])
        }
    });
}

Staff.getStaffById = (staffId, result) => {
    db.query(`SELECT staff.*,position.poname , position.salary , shift.hourcount, shift.shiftname, shift.timework FROM staff INNER JOIN position ON staff.id_position=position.id INNER JOIN shift ON staff.id_shift=shift.id WHERE staff.id ='${staffId}' `, 
    async (err, res) => {
        if(err) {
            console.log(err)
            result(err, null);
        } else {
            handleOutput(res[0])
            result(null,res[0])
        }
    });
}


Staff.save= (staff) => {
    db.query(`INSERT INTO staff SET ?`,staff, (error)=> {
        if(error) throw error; 
    })
}

Staff.isExist = (name, isTrue) => {
    Staff.getStaffByName(name, (err, result) => {
        if(err) throw err;
        if(result === undefined) {
            isTrue(false)
        } else { isTrue(true) }       
    })
}

Staff.delete= (staffId, result) => {
    const sql = `DELETE FROM staff WHERE id= '${staffId}' `;
    db.query(sql, (err, res) => {
        if(err) {
            console.log(err);
            result(err, null)
        } else result(null,res);
    })
}

Staff.update = ( staffID , staff , result) => {
    const sql = `UPDATE staff SET ? WHERE id = '${staffID}' `;
    db.query(sql, staff , (err, res)=> {
        if(err) {
            result(null, err);
        } else {
            result(null, res)
        }
    })
}


module.exports = Staff;