const express = require('express')
const app = express();

const fetch = require('node-fetch')
const cors = require('cors')
require('dotenv').config()

const loginRoute = require('./routes/login.route')
const logoutRoute = require('./routes/logout.route')
const registerRoute = require('./routes/register.route')
const productRoute = require('./routes/product.route')
const accountRoute = require('./routes/user.route')
const cartRoute = require('./routes/cart.route')
const adminRoute = require('./routes/admin.route')
const { requireAuth , handleMessage } = require('./middlewares/auth.middleware')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');


app.use(cors())
app.use(cookieParser())
app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
	if (res.app.locals.users === undefined) {
		res.app.locals.users = []
	}
	next()
})


const path = require('path')
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.use('/login', loginRoute)
app.use('/user', registerRoute)
app.use('/product', requireAuth, handleMessage , productRoute)
app.use('/account', requireAuth, accountRoute)
app.use('/cart', requireAuth, cartRoute)
app.use('/admin', requireAuth , handleMessage ,adminRoute)
app.use('/', logoutRoute)
// GET POST PUT DELETE PATCH
app.listen(process.env.PORT || 5000, () => console.log('Listening on port', process.env.PORT || 5000))

app.get('/login', (req, res) => {
	res.render('login/login')
})

app.get('/', requireAuth, async (req, res) => {
	try {
		let data = await fetch(process.env.ROOT_API_PATH + 'customer/new-release', { method: 'GET' })

		let response = await data.json()

		const dataBrand = await fetch(process.env.ROOT_API_PATH + 'customer/brand', {method : 'GET'})
        let brands = await dataBrand.json()

        const dataCategory = await fetch(process.env.ROOT_API_PATH + 'customer/category', {method : 'GET'})
        let categories = await dataCategory.json()

		if (response.code === 200) {
			return res.render('index', {
				data: response.data,
				brand : brands.data,
				category : categories.data
			})
		}
	} catch (err) {
		console.log(err)
	}
});

