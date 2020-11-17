const express = require('express')
const path = require('path')
const app = express()
// express config
app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
// ======== ROUTES ========
app.get('/cups', async (req, res) => {
  res.sendFile('views/cups.html', { root: __dirname })
})

app.listen(3000, () => {
  console.log('listening on 3000')
})
