const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')
const user = require('../models/user')
const User = require('../models/user')

router.get('/', async (req, res) => {
  const id = req.session.userId
  if (!req.session.isGuest) {
    const user = await User.findById(id).populate('todos')
    console.log(user)
    res.render('todo', { title: 'Tasks', user })
  } else {
    const user = req.session // .todos will be an array of todos
    console.log(user)
    res.render('todo', { title: 'Tasks', user })
  }
})

router.post('/', async (req, res) => {
  const { task } = req.body
  if (!req.session.isGuest) {
    const id = req.session.userId
    console.log(id)
    // const todo = new Todo({ task })
    // await todo.save()
    // const user = await User.findById(id)
    // user.todos.push(todo)
    // await user.save()
    // console.log(user)
  } else {
    const lastId = req.session.todos[-1]._id
    req.session.todos.push({ _id: lastId ? lastId + 1 : 1, task: task })
    console.log(req.session)
  }
  res.redirect('/tasks')
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  // console.log(id)
  const task = await Todo.findByIdAndDelete(id)
  res.redirect('/tasks')
})

module.exports = router
