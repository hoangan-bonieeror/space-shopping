const Shift = require('../model/shift.model')

module.exports.getAllShift = (req,res) => {
    try {
        Shift.getAllShift((shiftList)=> {
            return res.json({
                code : 200,
                status : 'OK',
                data : shiftList
            })
        })
    } catch(err) {
        console.log(err)
        return res.json({
            code : 500,
            status : 'Internal Error',
            message : 'Something went wrong'
        })
    }
}