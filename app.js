const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const Todo = require('./models/todo')
const methodOverride = require('method-override')

const app = express()
// express config
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// connect mongoose
const dbUrl = 'mongodb://localhost:27017/todo'
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

app.use(express.urlencoded({ extended: true })) // parses the post requests
app.use(express.static(path.join(__dirname, 'public')))

app.use(methodOverride('_method'))

// ======== ROUTES ========
app.get('/cups', (req, res) => {
  res.render('cups', { title: 'Cups' })
})

app.get('/timer', (req, res) => {
  res.render('timer', { title: 'Timer' })
})

app.get('/tasks', async (req, res) => {
  const tasks = await Todo.find({})
  res.render('todo', { title: 'Tasks', tasks })
})

app.post('/tasks', async (req, res) => {
  const { task } = req.body
  const todo = new Todo({ task })
  await todo.save()
  res.redirect('/tasks')
})

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params
  // console.log(id)
  const task = await Todo.findByIdAndDelete(id)
  res.redirect('/tasks')
})

app.listen(3000, () => {
  console.log('listening on 3000')
})
