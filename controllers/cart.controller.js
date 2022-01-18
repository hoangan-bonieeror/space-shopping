const fetch = require('node-fetch')
require('dotenv').config()


module.exports.addToCart = (req,res) => {
    try {
        if(res.locals.isLogin === false) {
            res.app.locals.message = 'Required Account'
            return res.redirect('/product/all')
        }
        let { id_product, quantity } = req.params

        let { name , price } = req.body
        res.app.locals.users.forEach((user,index) => {
            if(user.id === parseInt(req.cookies.id)) {
                if(user.cart.length === 0) {
                    res.app.locals.users[index].cart.push({
                        id : id_product,
                        name : name,
                        qty : parseInt(quantity),
                        sub_total : parseInt(price) * parseInt(quantity)
                    })
                } else {
                    let isExist =false
                    res.app.locals.users[index].cart.forEach((item, i) => {
                        if(item.id === id_product) {
                            item['qty'] = parseInt(item['qty']) + parseInt(quantity)
                            item['sub_total'] = parseInt(item['qty']) * parseInt(price)
                            isExist = true
                        }
                    })

                    if(!isExist) {
                        res.app.locals.users[index].cart.push({
                            id : id_product,
                            name : name,
                            qty : parseInt(quantity),
                            sub_total : parseInt(price) * parseInt(quantity)
                        })
                    }
                }
            }
            // console.log(res.app.locals.users[index].cart)
        })
        return res.redirect('/product/all')
    } catch(err) {
        console.log(err)
    }  
}


module.exports.getInCheckout = (req,res,next) => {
    try {
        res.app.locals.users.forEach((user, index) => {
            if(user.id ===  res.locals.currentUser.id) {
                res.locals.cart = res.app.locals.users[index].cart
            }
        })
        next()
    } catch(err) {

    }
}

module.exports.checkout = async (req,res) => {
    try {
        const {
            firstname,
            lastname,
            address,
            city,
            numberphone
        } = req.body

        let cart;
        let cartIndex;
        let total_price = 0
        res.app.locals.users.forEach((user, index) => {
            if(user.id === parseInt(req.cookies.id)) {
                cart = res.app.locals.users[index].cart
                cartIndex = index
            }
        })

        cart.forEach(item => total_price += item.sub_total)

        let shoppingCart = {
            email : res.locals.currentUser.email,
            id_user : res.locals.currentUser.id,
            firstname : firstname,
            lastname : lastname,
            address : address,
            city : city,
            numberphone : numberphone,
            total_price : total_price.toString(),
            data : cart
        }

        console.log(shoppingCart.data)
        console.log(JSON.stringify(shoppingCart))
        let data = await fetch(process.env.ROOT_API_PATH + 'cart/order', {
            method : 'POST',
            body : JSON.stringify(shoppingCart),
            headers : { 'token' : res.locals.currentUser.token,
                        'Content-Type' : 'application/json' }
        })

        let response = await data.json()


        console.log(response)


        if(response.code === 200) {
            res.app.locals.users[cartIndex].cart = new Array()
            res.redirect('/product/all')
            return;
        } else {
            console.log(response)
        }
    } catch(err) {
        console.log(err)
    }
}