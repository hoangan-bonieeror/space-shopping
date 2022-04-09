

module.exports = {
    getCart : function (req,res) {
        try {
            let id_user = req.params.id

            // console.log(req.app.locals.users)
            req.app.locals.users.forEach((user, index) => {
                // console.log(user.id)
                if(user.id === parseInt(id_user)) {
                    return res.json({
                        code : 200,
                        status : 'Successfully',
                        data : user.cart,
                        totalQty : user.quantity
                    })
                }
            })
        }

        catch (err) {
            res.json({
                code : 500,
                status : 'Internal Error',
                msg : 'Something went wrong'
            })
        }
    },

    addToCart : (req,res) => {
        try {
            let { id, name, price } = req.body
            let id_user = req.params.id

            req.app.locals.users.forEach((user, index) => {
                if(user.id === parseInt(id_user)) {
                    let itemExist = req.app.locals.users[index].cart.find(item => item.id === id)

                    if(itemExist !== undefined) {
                        let indexItem = user.cart.findIndex(item => item.id === id)
                        
                        user.cart[indexItem].qty = parseInt(user.cart[indexItem].qty) + 1
                        user.cart[indexItem].sub_total = parseInt(user.cart[indexItem].qty) * parseInt(user.cart[indexItem].price)
                        user.quantity ++
                        return res.json({
                            code : 200,
                            status : 'Successfully',
                            msg : `Product ${id} increased quantity`,
                            itemNew : user.cart[indexItem]
                        })
                    } else {
                        let { id, name, price , image } = req.body
                        let item = {
                            id : id,
                            name : name,
                            price : price,
                            image : image,
                            qty : 1,
                            sub_total : parseInt(price)
                        }

                        user.cart.push(item)
                        user.quantity ++
                        return res.json({
                            code : 200,
                            status : 'Successfully',
                            msg : `Product ${id} has added to the cart`,
                            itemNew : item
                        })
                    }
                }
            });
        } catch (err) {
            console.log(err)
            res.json({
                code : 500,
                status : 'Internal Error',
                msg : 'Something went wrong'
            })
        }
    },

    updateQuantityItem : (req,res) => {
        try {
            let { id_user, id_product } = req.params

            let existUser = false;
            req.app.locals.users.forEach(user => {
                if(user.id === parseInt(id_user)) {
                    existUser = true;
                    let indeExistProduct = user.cart.findIndex(item => parseInt(item.id) === parseInt(id_product))
                    console.log(indeExistProduct)
                    if(indeExistProduct >= 0) {
                        let { quantity } = req.body
                        quantity = parseInt(quantity)

                        user.cart[indeExistProduct].qty = parseInt(user.cart[indeExistProduct].qty) + quantity
                        return res.json({
                            code : 200,
                            status : 'Successfully',
                            msg : 'Updated',
                            item :  user.cart[indeExistProduct]
                        })
                    } else {
                        return res.json({
                            code : 400,
                            status : 'Bad Request',
                            msg : 'This item does not be in the cart'
                        })
                    }
                }
            })

            if(!existUser) {
                return res.json({
                    code : 400,
                    status  : 'Bad Request',
                    msg : 'User is offline'
                })
            }
        } catch(err) {
            console.log(err)
            res.json({
                code : 500,
                status : 'Internal Error',
                msg : 'Something went wrong'
            })
        }
    },

    deleteItem : (req,res) => {
        try {
            let { id_user , id_product, qty } = req.params
            
            let isOnline = false;
            req.app.locals.users.forEach((user) => {
                if(user.id === parseInt(id_user)) {
                    isOnline = true
                    let indexExistProduct = user.cart.findIndex(item => parseInt(item.id) === parseInt(id_product))
                
                    if(indexExistProduct >= 0) {
                        user.quantity -= parseInt(user.cart[indexExistProduct].qty)
                        user.cart = user.cart.filter(item => parseInt(item.id) !== parseInt(id_product))
                        return res.json({
                            code : 200,
                            status : 'Successfully',
                            msg : 'Deleted'
                        })
                    } else {
                        return res.json({
                            code : 400,
                            status : 'Bad Request',
                            msg : 'This item does not be in the cart'
                        })
                    }
                }
            })

            if(!isOnline) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    msg : 'User is offline'
                })
            }
        } catch(err) {
            console.log(err)
            res.json({
                code : 500,
                status : 'Internal Error',
                msg : 'Something went wrong'
            })
        }
    }
} 