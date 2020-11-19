const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
  task: String
})

module.exports = mongoose.model('Task', TodoSchema)
