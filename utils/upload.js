const multer = require('multer')
const upload = multer({dest : '../assets/product'}).fields([{name : 'images', maxCount : 5}])

module.exports = upload;