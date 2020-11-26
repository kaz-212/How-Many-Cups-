const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const methodOverride = require('method-override')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const session = require('express-session')
const MongoDbStore = require('connect-mongo')(session)

const tasks = require('./routes/tasks')
const users = require('./routes/user')

const app = express()
// express config
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const dbUrl = process.env.DB_URL

const store = new MongoDbStore({
  url: dbUrl,
  secret: process.env.SECRET,
  touchAfter: 60 * 60 * 24
})

store.on('error', e => {
  console.log('SESSION STORE ERROR', e)
})

app.use(
  session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 5
    }
  })
)

// connect mongoose
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

// ======== MIDDLEWARE ========

const isLoggedin = (req, res, next) => {
  if (!req.session.userId) {
    req.session.userId = uuidv4()
    req.session.isGuest = true
    req.session.todos = []
  }
  // console.log(req.session.userId, req.session.isGuest)
  next()
}

app.use(express.urlencoded({ extended: true })) // parses the post requests
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(methodOverride('_method'))
app.use(isLoggedin)

app.use((req, res, next) => {
  res.locals.isGuest = req.session.isGuest
  next()
})

// ======== ROUTES ========
app.use('/tasks', tasks)
app.use('/users', users)

app.get('/', async (req, res) => {
  res.render('home', { title: 'Home' })
})

app.get('/cups', (req, res) => {
  res.render('cups', { title: 'Cups' })
})

app.get('/timer', (req, res) => {
  res.render('timer', { title: 'Timer' })
})

let port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('listening on 3000')
})
