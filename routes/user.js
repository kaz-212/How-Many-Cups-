const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')

const User = require('../models/user')
const bcrypt = require('bcrypt')

// middleware
const loggedIn = (req, res, next) => {
  if (!req.session.isGuest) {
    return res.redirect('/timer')
  }
  next()
}

// routes

router.get('/login', loggedIn, async (req, res) => {
  res.render('login', { title: 'Login' })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (user) {
    // console.log(user)
    const match = await bcrypt.compare(password, user.password)
    if (match) {
      req.session.userId = user._id
      req.session.isGuest = false
      return res.redirect('/timer')
    }
    res.redirect('/user/login')
  }
  // TODO: if already have some todos in session, add them to the users todos
})

router.get('/logout', async (req, res) => {
  req.session.userId = uuidv4()
  req.session.isGuest = true
  res.redirect('/timer')
})

router.post('/signup', async (req, res) => {
  const { username, password } = req.body
  const hashed = await bcrypt.hash(password, 12)
  const user = new User({ username, password: hashed })
  user.save()
  req.session.userId = user._id
  res.redirect('/')
})

module.exports = router
