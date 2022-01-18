const Position = require('../model/position.model')

module.exports.getAllPosition = (req,res) => {
    try {
        Position.getAllPosition((positionList) => {
            return res.json({
                code : 200,
                status : 'OK',
                data : positionList
            })
        })
    } catch (err) {
        console.log(err)
        return res.json({
            code : 500,
            status : 'Internal Error'
        })
    }
}