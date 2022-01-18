const db = require('../db') 

const Position = function(position) {
    this.poname = position.poname
    this.salary = position.salary
}

Position.getAllPosition = (result) => {
    db.query('SELECT * FROM position', (error, positionList) => {
        if(error) throw error;
        else result(positionList)
    })
}


module.exports = Position