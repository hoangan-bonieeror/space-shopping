const db = require('../db') 

var Material = function(material) {
    this.materialname = material.materialname,
    this.quantity = material.quantity,
    this.unit = material.unit,
    this.unitprice = material.unitprice
}

Material.getAllMaterial = (result) => {
    const sql = 'SELECT * FROM material';
    db.query(sql, (err, materialList)=> {
        if(err) {
            result(err, null);
        } else {
            result(null, materialList);
        }
    }) 
}

Material.save = (material) => {
    db.query(`INSERT INTO material SET ?`, material, (error)=> {
        if(error) throw error; 
    })
}

Material.getMaterialByName = (name,result) => {
    db.query(`SELECT * FROM material WHERE materialname="${name}"`, (error, res) => {
        if(error) throw error;
        else result(res)
    })
}

module.exports = Material;