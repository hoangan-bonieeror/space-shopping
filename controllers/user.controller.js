const fetch = require('node-fetch');
require('dotenv').config()
const FormData = require('form-data')
const fs = require('fs')

module.exports.viewCreateUser = async (req,res) => {
    try {
        let data = await fetch('https://provinces.open-api.vn/api/?depth=2', { method : 'GET' })

        let response = await data.json()
    
        return res.render('admin/user-create', {
            cityList : response,
            currentPage : 'user'
        })
    } catch (err) {
        console.log(err)
    }
}

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

        const dataBrand = await fetch(process.env.ROOT_API_PATH + 'customer/brand', {method : 'GET'})
        let brands = await dataBrand.json()

        const dataCategory = await fetch(process.env.ROOT_API_PATH + 'customer/category', {method : 'GET'})
        let categories = await dataCategory.json()
        
        return res.render('admin/product-page',{
            products : products.data,
            key : key ? key : '',
            categories : categories.data,
            brands : brands.data,
            currentPage : 'product'
        })
    } catch(err) {
        console.log(err)
    }
}

module.exports.filterProduct = async (req,res) => {
    try {
        const {
            id_category,
            id_brand
        } = req.query

        let api_path = process.env.ROOT_API_PATH + 'customer/product'

        let arrKey = []
        if(id_brand && id_brand != 0) {
            arrKey.push(`brandId=${id_brand}`) 
        }

        if(id_category && id_category != 0) {
            arrKey.push(`categoryId=${id_category}`) 
        }

        let keyString = '?'

        keyString += arrKey.join('&')

        api_path += keyString

        console.log(api_path)
        let response = await fetch(api_path, {
            method : 'GET'
        })

        let data = await response.json()

        if(data.code === 200) {
            const dataBrand = await fetch(process.env.ROOT_API_PATH + 'customer/brand', {method : 'GET'})
            let brands = await dataBrand.json()
    
            const dataCategory = await fetch(process.env.ROOT_API_PATH + 'customer/category', {method : 'GET'})
            let categories = await dataCategory.json()

            return res.render('admin/product-page', {
                products : data.data,
                categories : categories.data,
                brands : brands.data,
                currentPage : 'product',
                filterResult : {
                    brand : brands.data.find(one => {
                        return one.id == id_brand
                    }),
                    category :categories.data.find(one => {
                        return one.id == id_category
                    })
                }
            })
        }

    } catch(err) {
        console.log(err)
    }
}

module.exports.viewOrderPage = async (req,res) => {
    try {
        let api_path = `${process.env.ROOT_API_PATH}cart/filter/${req.query.status}`

        let { email } = req.query

        api_path += `?email=${(!email || email && email === 'empty') ? '' : email}` 


        if(req.query.key) {
            api_path = process.env.ROOT_API_PATH + `cart/filter/${6}?email=${req.query.key}`
            var key = req.query.key
        }

        let page = 1

        api_path += ('&page=' + page)

        // console.log(api_path)

        const orderData = await fetch(api_path,
            {
                method : 'GET',
                headers : { 
                    'token' : req.cookies.token
                }
            })
        
        let orders = await orderData.json()

        const userData = await fetch(process.env.ROOT_API_PATH + 'user',
            {
                method : 'GET',
                headers : { 
                    'token' : req.cookies.token
                }
            })
        let users = await userData.json()
        users.listUsers = users.listUsers.filter(user => {
            return user.isadmin === false
        })

        let status;
        switch(parseInt(req.query.status)) {
            case 1 : 
                status = 'Pending'
                break;
            case 2 : 
                status = 'Confirmed'
                break;
            case 3 : 
                status = 'Delivering'
                break;
            case 4 : 
                status = 'Delivered'
                break;
            case 5 : 
                status = 'Cancel'
                break;
            case 6 : 
                status = 'All'
                break;
        }
        
        return res.render('admin/order-page',{
            orders : orders.data,
            users : users.listUsers,
            filterResult : (key || (!key && (email === 'empty' || email === undefined)  && parseInt(req.query.status) === 6)) ? null : {
                email : email,
                status : (status) ? status : '' 
            },
            currentPage : 'order',
            key : key ? key : ''
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
            users : users.listUsers,
            currentPage : 'user'
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
            brands : brands.data,
            currentPage : 'product'
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

        if(fileImages) {
            fileImages.forEach(img => {
                body.append('images', fs.createReadStream(img.path), {
                    filename : img.originalname,
                    filepath : img.path,
                    contentType : img.mimetype
                })
            });
        }

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
        if(response.code !== 200) {
            res.app.locals.existMessage = response.message
            return res.redirect('back')
        }
        return res.redirect('/admin/product')
    } catch(err) {
        console.log(err)
    }
}

module.exports.putProduct = async (req,res) => {
    try {
        const productInput = {
            name,
            price,
            id_brand,
            id_category
        } = req.body
        
        productInput['id_brand'] = parseInt(productInput['id_brand'])
        productInput['id_category'] = parseInt(productInput['id_category'])

        let api_path = process.env.ROOT_API_PATH + `product/update/${req.params.id}`

        let data = await fetch(api_path, {
            method : 'PUT',
            body : JSON.stringify(productInput),
            headers : {
                'Content-Type' : 'application/json',
                'token' : req.cookies.token
            }
        }) 

        let response = await data.json()

        console.log(response)

        return res.redirect('back')
    } catch (err) {
        console.log(err)
    }
}

module.exports.viewDetailProduct = async (req,res) => {
    try {
        let { id_product } = req.params

        let api_path = process.env.ROOT_API_PATH + `product/${id_product}`

        let data = await fetch(api_path, {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                'token' : req.cookies.token 
            }
        })

        let response = await data.json()

        const dataBrand = await fetch(process.env.ROOT_API_PATH + 'customer/brand', {method : 'GET'})
        let brands = await dataBrand.json()

        const dataCategory = await fetch(process.env.ROOT_API_PATH + 'customer/category', {method : 'GET'})
        let categories = await dataCategory.json()

        // console.log(response)
        if(response.code === 200) {
            return res.render('admin/detail-product', {
                product : response.data,
                categories : categories.data,
                brands : brands.data
            })
        }
    } catch(err) {
        console.log(err)
    }
}

module.exports.viewBrandPage = async (req,res) => {
    try {
        const dataBrand = await fetch(process.env.ROOT_API_PATH + 'customer/brand', {method : 'GET'})
        let brands = await dataBrand.json()

        if(brands.code === 200) {
            return res.render('admin/brand-page', {
                brands : brands.data,
                currentPage : 'brand'
            })
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports.postBrand = async (req,res) => {
    try {
        const body = {
            name : name
        } = req.body

        const api_path = process.env.ROOT_API_PATH + 'brand/add'

        let response = await fetch(api_path, {
            method : 'POST',
            body : JSON.stringify(body),
            headers : {
                'Content-Type' : 'application/json',
                'token' : (req.cookies.token) ? req.cookies.token : '' 
            }
        })

        let data = await response.json()
        // console.log(data)
        if(data.code === 400) {
            res.app.locals.existMessage = data.message
        }
        return res.redirect('back')
    } catch (err) {
        console.log(err)
    }
}

module.exports.putBrand = async (req,res) => {
    try {
        const body = {
            name_brand : name_brand
        } = req.body

        const { id } = req.params

        const api_path = process.env.ROOT_API_PATH + `brand/update/${id}`
        console.log(body)
        const response = await fetch(api_path, {
            method : 'PUT',
            body : JSON.stringify(body),
            headers : {
                'Content-Type' : 'application/json',
                'token' : (req.cookies.token) ? req.cookies.token : '' 
            }
        })

        let data = await response.json()
        console.log(data)
        if(data.code === 200) {
            return res.redirect('back')
        }
    } catch (err) {
        console.log(err)
    }
}
module.exports.viewCategoryPage = async (req,res) => {
    try {
        const datacategory = await fetch(process.env.ROOT_API_PATH + 'customer/category', {method : 'GET'})
        let categories = await datacategory.json()

        if(categories.code === 200) {
            return res.render('admin/category-page', {
                categories : categories.data,
                currentPage : 'category'
            })
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports.postCategory = async (req,res) => {
    try {
        const body = {
            name : name
        } = req.body

        const api_path = process.env.ROOT_API_PATH + 'category/add'

        const response = await fetch(api_path, {
            method : 'POST',
            body : JSON.stringify(body),
            headers : {
                'Content-Type' : 'application/json',
                'token' : (req.cookies.token) ? req.cookies.token : '' 
            }
        })

        let data = await response.json()
        // console.log(data)
        if(data.code === 400) {
            res.app.locals.existMessage = data.message
        }
        return res.redirect('back')
    } catch (err) {
        console.log(err)
    }
}

module.exports.putCategory = async (req,res) => {
    try {
        const body = {
            name_category : name_category
        } = req.body

        const { id } = req.params

        const api_path = process.env.ROOT_API_PATH + `category/update/${id}`
        
        const response = await fetch(api_path, {
            method : 'PUT',
            body : JSON.stringify(body),
            headers : {
                'Content-Type' : 'application/json',
                'token' : (req.cookies.token) ? req.cookies.token : '' 
            }
        })

        let data = await response.json()
        console.log(data)
        if(data.code === 200) {
            return res.redirect('back')
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports.searchBrand = async (req,res) => {
    try {
        const { key } = req.query

        let api_path = process.env.ROOT_API_PATH + `brand?key=${key}`

        const response = await fetch(api_path, {
            method : 'GET',
            headers : {
                'token' : req.cookies.token
            }
        })

        const data = await response.json()

        if(data.code === 200) {
            // console.log(data)
            return res.render('admin/brand-page', {
                brands : data.data,
                key : data.queryWord,
                currentPage : 'brand'
            })
        }
    } catch (err) {
        console.log(err)
    }
}


module.exports.searchCategory = async (req,res) => {
    try {
        const { key } = req.query

        let api_path = process.env.ROOT_API_PATH + `category?key=${key}`

        const response = await fetch(api_path, {
            method : 'GET',
            headers : {
                'token' : req.cookies.token
            }
        })

        const data = await response.json()

        if(data.code === 200) {
            // console.log(data)
            return res.render('admin/category-page', {
                categories : data.data,
                key : data.queryWord,
                currentPage : 'category'
            })
        }
    } catch (err) {
        console.log(err)
    }
}


module.exports.deleteBrand = async (req,res) => {
    try {
        let { id } = req.params

        let api_path = process.env.ROOT_API_PATH + `brand/delete/${id}`

        let response = await fetch(api_path, {
            method : 'DELETE',
            headers : {
                'token' : req.cookies.token
            }
        })

        let data = await response.json()

        if(data.code === 200) {
            return res.redirect('back')
        } else {
            return res.send(JSON.stringify(data))
        }

    } catch (err) {
        console.log(err)
    }
}

module.exports.deleteCategory = async (req,res) => {
    try {
        let { id } = req.params

        let api_path = process.env.ROOT_API_PATH + `category/delete/${id}`

        let response = await fetch(api_path, {
            method : 'DELETE',
            headers : {
                'token' : req.cookies.token
            }
        })
        
        let data = await response.json()
        
        if(data.code === 200) {
            return res.redirect('back')
        } else {
            return res.send(JSON.stringify(data))
        }

    } catch (err) {
        console.log(err)
    }
}