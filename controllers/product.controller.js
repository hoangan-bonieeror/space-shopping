const express = require('express')
const app = express();
require('dotenv').config()
const fetch = require('node-fetch');

app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const getAllProduct = async (req,res) => {
    try {
        let api_path = process.env.ROOT_API_PATH + 'customer/product'

        if(req.query.key) {
            api_path += `/search?key=${req.query.key}`
            var key = req.query.key
        }

        const data = await fetch(api_path, {method : 'GET'})
        let products = await data.json()

        const dataBrand = await fetch(process.env.ROOT_API_PATH + 'customer/brand', {method : 'GET'})
        let brands = await dataBrand.json()

        const dataCategory = await fetch(process.env.ROOT_API_PATH + 'customer/category', {method : 'GET'})
        let categories = await dataCategory.json()
        
        return res.render('product/index',{
            products : products.data,
            message : (res.app.locals.message) ? res.app.locals.message : '',
            brand : (brands.code === 200) ? brands.data : [],
            category : (categories.code == 200) ? categories.data : [],
            key : key ? key : ''
        })
    } catch (err) {
        console.log(err)
    }
}

const filterProduct = async (req,res) => {
    try {
        let api_path = process.env.ROOT_API_PATH + 'customer/product'

        if(req.query.id_brand) {
            api_path += `?brandId=${req.query.id_brand}`
            if(req.query.id_category) {
                api_path += `&categoryId=${req.query.id_category}`
            }
        } else {
            if(req.query.id_category) {
                api_path += `?categoryId=${req.query.id_category}`
            }
        }


        const data = await fetch(api_path, {method : 'GET'})
        let products = await data.json()

        const dataBrand = await fetch(process.env.ROOT_API_PATH + 'customer/brand', {method : 'GET'})
        let brands = await dataBrand.json()

        const dataCategory = await fetch(process.env.ROOT_API_PATH + 'customer/category', {method : 'GET'})
        let categories = await dataCategory.json()

        return res.render('product/index',{
            products : (products.code === 200) ? products.data : [],
            brand : (brands.code === 200) ? brands.data : [],
            category : (categories.code === 200) ? categories.data : []
        })
    } catch (err) {
        console.log(err)
    }
}

const activeProduct = async (req,res) => {
    try {
        let {
            status,
            id_product
        } = req.body

        console.log(id_product, status)
        let api_path = process.env.ROOT_API_PATH + 'product/active/'
        api_path += id_product

        status = (status == 'enable') ? true : false

        let data = await fetch(api_path, {
            method : 'POST',
            body : JSON.stringify({value : status}),
            headers : {
                'Content-Type' : 'application/json',
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

const viewDetailProduct = async (req,res) => {
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

        // console.log(response)
        if(response.code === 200) {
            return res.render('product/detail', {
                product : response.data
            })
        }
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    getAllProduct,
    filterProduct,
    activeProduct,
    viewDetailProduct
}