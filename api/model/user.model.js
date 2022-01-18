const db = require('../db') 
const shortid = require('shortid')

var User = function(user) { 
    this.id = shortid.generate();
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.username = user.username;
    this.password = user.password;
    this.createAt = new Date();
} 

User.getAllUsers = (result) => {
    db.query("SELECT * from users", (err, res) => {
        if(err) {
            console.log(err)
            result(null, err);
        } else {
            result(null,res)
        }
    });
}

User.getUserByUsername = (username, result) => {
    db.query(`SELECT * FROM users WHERE username ='${username}'`, (err, res) => {
        if(err) {
            console.log(err)
            result(null, err);
        } else {
            result(null,res)
        }
    });
}

User.getUserById = (userId, result) => {
    db.query(`SELECT * FROM users WHERE id ='${userId}'`, (err, res) => {
        if(err) {
            console.log(err)
            result(null, err);
        } else {
            result(null,res[0])
        }
    });
}


User.save= (user,result) => {
    db.query(`INSERT INTO users SET ?`,user, (error, res)=> {
        if(error) console.log(error);
        result(null,res);
    })
}

User.delete= (userId, result) => {
    const sql = `DELETE FROM users WHERE id= '${userId}' `;
    db.query(sql, (err, res) => {
        if(err) console.log(err);
        result(null,res);
    })
}

User.isExist = (username, isTrue) => {
    User.getUserByUsername(username, (err, result) => {
        if(err) throw err;
        if(result.length === 0) {
            isTrue(result[0],false)
        } else { isTrue(result[0],true) }       
    })
}

module.exports = User;