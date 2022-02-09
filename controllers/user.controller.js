const fetch = require('node-fetch');
require('dotenv').config()
const FormData = require('form-data')
const fs = require('fs')

module.exports.viewMyAccount = async (req, res) => {
    let data = await fetch('https://provinces.open-api.vn/api/?depth=2', { method : 'GET' })

    let response = await data.json()

    return res.render('login/customer/my-account', {
        cityList : response 
    })
}

module.exports.viewChangePassword = (req, res) => {
    return res.render('login/customer/changePassword')
}


module.exports.changePassword = async (req,res) => {
    try {
        let body = { password : password , re_password : re_password } = req.body
    
        body['email'] = res.locals.currentUser.email
        
        let data = await fetch(process.env.ROOT_API_PATH + `user/${req.cookies.id}/change-password`, {
            method : 'POST' ,
            body : JSON.stringify(body),
            headers : { 
                'Content-Type' : 'application/json',
                'token' : res.locals.currentUser.token }
        })


        let response = await data.json()
        console.log(response)
        if(response.code === 200) {
            return res.redirect('/account/my/user')
        } 
    } catch(err) {
        console.log(err)
    }
}

module.exports.viewMyOrder = async (req, res) => {
    let id_user = req.params.id

    let data = await fetch(process.env.ROOT_API_PATH + `cart/getorderbyuser/${id_user}/6`, {
        method: 'GET',
        headers: { 'token': req.cookies.token }
    })

    let response = await data.json()

    await response.data.sort((order1, order2)=> {
        return new Date(order2.createdAt) - new Date(order1.createdAt)
    })

    return res.render('login/customer/my-order', {
        order: (response.code === 200) ? response.data : []
    })
}

module.exports.viewMyCheckout = async (req,res) => {
    try {
        let data = await fetch('https://provinces.open-api.vn/api/?depth=2', { method : 'GET' })

        let response = await data.json()
    
        return res.render('checkout/index', {
            cityList : response
        })
    } catch(err) {
        console.log(err)
    }
}


module.exports.cancelOrder = async (req, res) => {
    try {
        let id_order = req.params.id

        let api_path = process.env.ROOT_API_PATH + `cart/cancel/${id_order}`

        console.log(api_path)

        let data = await fetch(api_path, {
            method : 'PUT',
            headers: { 'token': req.cookies.token }
        })

        let response = await data.json()

        if(response.code === 200) {
            res.redirect(`/account/my/order/${req.cookies.id}`)
        } 
    } catch (err) {
        console.log(err)
    }
}


module.exports.updateInfo = async (req,res) => {
    try {
        let body = {
            firstname : firstname,
            lastname : lastname,
            mobile_number : mobile_number,
            address : address,
            city : city,
            comment : comment
        } = req.body

        let data = await fetch(process.env.ROOT_API_PATH + `user/${req.cookies.id}/update`, {
            method : 'PUT',
            body : JSON.stringify(body),
            headers : {
                'Content-Type' : 'application/json',
                'token' : req.cookies.token
            }
        })

        let response = await data.json()
        console.log(`Request ${Date.now().toLocaleString()} : `,response)

        return res.redirect('/account/my/information')

    } catch (err) {
        return res.redirect('/account/my/information')
    }
}

module.exports.viewProductPage = async (req,res) => {
    try {
        let api_path = process.env.ROOT_API_PATH + 'product'

        if(req.query.key) {
            api_path += `?key=${req.query.key}`
            var key = req.query.key
        }

        const data = await fetch(api_path,
            {
                method : 'GET',
                headers : { 
                    'token' : req.cookies.token
                }
            })
        let products = await data.json()
        
        return res.render('admin/product-page',{
            products : products.data,
            key : key ? key : ''
        })
    } catch(err) {
        console.log(err)
    }
}

module.exports.viewOrderPage = async (req,res) => {
    try {
        let api_path = process.env.ROOT_API_PATH + 'cart/filter/'

        let statusInput = 6

        api_path += statusInput

        let email = ''

        if(req.query.key) {
            email = req.query.key
        }

        api_path += ('?email=' + email)

        let page = 1

        api_path += ('&page=' + page)

        const data = await fetch(api_path,
            {
                method : 'GET',
                headers : { 
                    'token' : req.cookies.token
                }
            })
        let orders = await data.json()
        return res.render('admin/order-page',{
            orders : orders.data
            // key : key ? key : ''
        })
    } catch(err) {
        console.log(err)
    }    
}

module.exports.viewUserPage = async (req,res) => {
    try {
        let api_path = process.env.ROOT_API_PATH + 'user'

        // if(req.query.key) {
        //     api_path += `?key=${req.query.key}`
        //     var key = req.query.key
        // }

        const data = await fetch(api_path,
            {
                method : 'GET',
                headers : { 
                    'token' : req.cookies.token
                }
            })
        let users = await data.json()
        
        
        return res.render('admin/user-page',{
            users : users.listUsers
            // key : key ? key : ''
        })
    } catch(err) {
        console.log(err)
    }
}


module.exports.viewCreateProduct = async (req,res) => {
    try {
        const dataBrand = await fetch(process.env.ROOT_API_PATH + 'customer/brand', {method : 'GET'})
        let brands = await dataBrand.json()

        const dataCategory = await fetch(process.env.ROOT_API_PATH + 'customer/category', {method : 'GET'})
        let categories = await dataCategory.json()

        return res.render('admin/product-create' , {
            categories : categories.data,
            brands : brands.data
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports.postProduct = async (req,res) => {
    try {
        const productInput = {
            name : name,
            id_category : price,
            id_brand : id_brand,
            id_category : id_category,
            description : description
        } = req.body

        const fileImages = req.files.images

        // console.log(fileImages)
        
        let api_path = process.env.ROOT_API_PATH + 'product/add'
        let body = new FormData();

        for(const [key, value] of Object.entries(productInput)) {
                body.append(key,value)
        }

        fileImages.forEach(img => {
            body.append('images', fs.createReadStream(img.path), {
                filename : img.originalname,
                filepath : img.path,
                contentType : img.mimetype
            })
        });

        body.append('gender', 'male')


        let data = await fetch(api_path, {
            method : 'POST',
            body : body,
            headers : {
                'token' : req.cookies.token
            }
        }) 

        let response = await data.json()

        console.log(response)

        return res.redirect('/admin/product')
    } catch(err) {
        console.log(err)
    }
}