const express = require('express')
const todo = require('../models/todo')
const router = express.Router()
const Todo = require('../models/todo')
const User = require('../models/user')

// TODO: when you click, clipboard...pop up: 'edit or delete'. Add edit functionality

router.get('/', async (req, res) => {
  const id = req.session.userId
  if (!req.session.isGuest) {
    const user = await User.findById(id).populate({ path: 'todos', sort: { order: 'asc' } })
    res.render('todo', { title: 'Tasks', user })
  } else {
    const user = req.session // .todos will be an array of todos
    res.render('todo', { title: 'Tasks', user })
  }
})

router.post('/', async (req, res) => {
  const { task, order } = req.body
  console.log(order)
  if (!req.session.isGuest) {
    const id = req.session.userId
    const todo = new Todo({ task, order })
    await todo.save()
    const user = await User.findById(id)
    user.todos.push(todo)
    await user.save()
  } else {
    let noOfTodos = 0
    for (let todo of req.session.todos) {
      if (todo.status == 'Todo') {
        noOfTodos++
      }
    }
    try {
      const lastId = req.session.todos[req.session.todos.length - 1]._id
      req.session.todos.push({ _id: lastId + 1, task, order: noOfTodos + 1 })
    } catch {
      req.session.todos.push({ _id: 0, task, order: noOfTodos + 1 })
    }
  }
  res.redirect('/tasks')
})

router.post('/order', async (req, res) => {
  const { id, followsId, status } = req.body
  console.log(status)
  let oldOrderNo = null
  let oldStatus = null
  let newOrderNo = null
  if (!req.session.isGuest) {
    await Todo.updateMany({ order: { $gte: newOrderNo }, status: status }, { $inc: { order: 1 } })
    await Todo.updateMany({ order: { $gte: oldOrderNo }, status: oldstatus }, { $inc: { order: -1 } })
    await Todo.findByIdAndUpdate(id, { order: newOrderNo, status: status })
  } else {
    for (let todo of todos) {
      if (todo._id == id) {
        oldOrderNo = todo.order
        oldStatus = todo.status
      } else if (todo._id == followsId) {
        newOrderNo = todo.order + 1
      }
    }
    for (let i = 0; i < req.session.todos.length; i++) {
      if (req.session.todo[i]._id == id) {
        todo.status = status
        todo.order = followsOrderNo + 1
      } else if (req.session.todo[i].status == status && req.session.todo[i].order >= newOrderNo) {
        req.session.todo[i].order++
      } else if (req.session.todo[i].status == oldStatus && req.session.todo[i].order >= oldOrderNo) {
        req.session.todo[i].order--
      }
    }
  }
  req.session.todos.sort(order)
  res.redirect('/tasks')
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const { isGuest, userId } = req.session
  if (!isGuest) {
    await Todo.findByIdAndDelete(id)
    await User.findByIdAndUpdate(userId, { $pull: { todos: id } })
  } else {
    console.log(id)
    for (let i = 0; i < req.session.todos.length; i++) {
      if (req.session.todos[i]._id == id) {
        req.session.todos.splice(i, 1)
      }
    }
  }
  res.redirect('/tasks')
})

module.exports = router
