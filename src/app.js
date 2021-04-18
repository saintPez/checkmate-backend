const path = require('path')

const express = require('express')

const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const createError = require('http-errors')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const passport = require('passport')
const flash = require('connect-flash')

const authRoutes = require('./routes/auth')
const authUsers = require('./routes/user')

const {
  SESSION_SECRET,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = require('./env')

require('./passport/local')
require('./passport/facebook')

// App

const app = express()

// View engine

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(helmet())
app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MySQLStore({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
    }),
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan('dev'))
app.use(flash())

// Routes

app.get('/', (req, res) => {
  req.flash('info', 'Flash is back!')
  res.render('home', { info: req.flash('info') })
})

app.use('/auth', authRoutes)
app.use('/user', authUsers)

// Errors

app.use((req, res, next) => {
  next(createError(404, 'Not found'))
})

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ success: false, status: err.status || 500, name: err.name, ...err })
  next()
})

module.exports = app
