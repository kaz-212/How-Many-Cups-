const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const User = require('./models/user')
const methodOverride = require('method-override')
const bcrypt = require('bcrypt')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const session = require('express-session')

const tasks = require('./routes/tasks')

const app = express()
// express config
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
)

// connect mongoose
const dbUrl = process.env.DB_URL
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
app.use(express.static(path.join(__dirname, 'public')))

app.use(methodOverride('_method'))
app.use(isLoggedin)

// ======== ROUTES ========
app.use('/tasks', tasks)

app.get('/', async (req, res) => {
  res.render('home', { title: 'Home' })
})

app.get('/login', async (req, res) => {
  res.render('login', { title: 'Login' })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (user) {
    // console.log(user)
    const match = await bcrypt.compare(password, user.password)
    if (match) {
      req.session.userId = user._id
      req.session.isGuest = false
      return res.redirect('/')
    }
    res.redirect('/login')
  }
  // TODO: if already have some todos in session, add them to the users todos
})

app.post('/signup', async (req, res) => {
  const { username, password } = req.body
  const hashed = await bcrypt.hash(password, 12)
  const user = new User({ username, password: hashed })
  user.save()
  req.session.userId = user._id
  res.redirect('/')
})

app.get('/cups', (req, res) => {
  res.render('cups', { title: 'Cups' })
})

app.get('/timer', (req, res) => {
  res.render('timer', { title: 'Timer' })
})

app.listen(3000, () => {
  console.log('listening on 3000')
})
