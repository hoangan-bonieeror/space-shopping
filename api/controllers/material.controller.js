const express = require('express');
const app = express();
require('dotenv').config()
const Material = require('../model/material.model')

app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const getAllMaterial = (req,res) => {
    try {
        return Material.getAllMaterial((err,data)=> {
            if(err) {
                console.log(err)
            } else {
                return res.render('material/index', {
                    materials : data
                })
            }
        })
    } catch(error) {
        console.log(error)
    }
} 

const addMaterial = async (req,res) => {
    try {
        const {
            name,
            unit,
            unitprice
        } = req.body


        if(!name || !unit || !unitprice) {
            return res.render('material/create' , {
                error : 'Fill in all the fields'
            })
        }

        Material.getMaterialByName(name, (result)=> {

            if(result.length !== 0) {
                return res.render('material/create', {
                    error : 'This material has been already added'
                })
            }

            const material = new Material({
                materialname : name,
                quantity : 0,
                unit : unit,
                unitprice : unitprice
            })
            Material.save(material)
        
            return res.redirect('/material/all')
        })

    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    getAllMaterial,
    addMaterial
}