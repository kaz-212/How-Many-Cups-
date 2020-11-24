const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')
const User = require('../models/user')

router.get('/', async (req, res) => {
  const id = req.session.userId
  if (!req.session.isGuest) {
    const user = await User.findById(id).populate('todos')
    res.render('todo', { title: 'Tasks', user })
  } else {
    const user = req.session // .todos will be an array of todos
    res.render('todo', { title: 'Tasks', user })
  }
})

router.post('/', async (req, res) => {
  const { task } = req.body
  if (!req.session.isGuest) {
    const id = req.session.userId
    const todo = new Todo({ task })
    await todo.save()
    const user = await User.findById(id)
    user.todos.push(todo)
    await user.save()
  } else {
    try {
      const lastId = req.session.todos[req.session.todos.length - 1]._id
      req.session.todos.push({ _id: lastId + 1, task })
    } catch {
      req.session.todos.push({ _id: 0, task })
    }
  }
  res.redirect('/tasks')
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const { isGuest, userId } = req.session
  if (!isGuest) {
    const task = await Todo.findByIdAndDelete(id)
    await User.findByIdAndUpdate(userId, { $pull: { todos: id } })
  } else {
    console.log(id)
    for (let i = 0; i < req.session.todos.length; i++) {
      if (req.session.todos[i]._id == id) {
        req.session.todos.splice(i, 1)
      }
    }
    console.log(req.session)
  }
  res.redirect('/tasks')
})

module.exports = router
