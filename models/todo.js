const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
  task: {
    type: String,
    required: true
  },
  status: {
    required: true,
    type: String,
    enum: ['Todo', 'Doing', 'Completed'],
    default: 'Todo'
  }
})

module.exports = mongoose.model('Task', TodoSchema)
