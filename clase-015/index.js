const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')

const port = 8080
const app = express()

// Nunjucks configure
nunjucks.configure('views', {
  autoescape: true,
  watch: true,
  express: app
})

// Middlewares
app.use(express.json())

// Nunjucks setup in express
app.set('views', path.join(__dirname, 'views'))
app.engine('.njk', nunjucks.render)
app.set('view engine', 'njk')
app.use(express.static(path.join(__dirname, 'public')))

// App
const html = require('./routes/html')
const telegram = require('./routes/telegram')
app.use('/html', html)
app.use('/telegram', telegram)

// Manejo de errores
app.use((error, req, res, next) => {
  const response = { ok: false, error: (error && error.message) || 'Unknown error' }
  if (process.env.NODE_ENV === 'development') {
    response.stack = (error && error.stack) || null
  }
  res.status(500).send(response)
})

// Manejo de 404
app.use((req, res, next) => {
  res.status(404).send({ ok: false })
})

// Comienzo de server
app.listen(port, () => {
  console.log(`Bunkero esta corriendo en http://localhost:${port}`)
})
