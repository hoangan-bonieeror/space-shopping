const db = require('../db') 

const Shift = function(shift) {
    this.shiftname = shift.shiftname
    this.hourcount = shift.hourcount
    this.timework = shift.timework
}


Shift.getAllShift = (result) => {
    db.query('SELECT * FROM shift', (err, shiftList) => {
        if(err) throw err;
        else result(shiftList)
    })
}

module.exports = Shift