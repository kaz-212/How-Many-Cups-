const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')

const app = express()
// express config
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
// ======== ROUTES ========
app.get('/cups', async (req, res) => {
  res.render('cups', { root: __dirname })
})

app.listen(3000, () => {
  console.log('listening on 3000')
})
