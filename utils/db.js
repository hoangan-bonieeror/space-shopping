require('dotenv').config()
const { Client } = require('pg')

const client = new Client({
  host : process.env.PGHOST,
  user : process.env.PGUSER,
  password : process.env.PGPASSWORD,
  port : process.env.PGPORT,
  database : process.env.PGDATABASE
})

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('Connected')
  }
})

module.exports =client;