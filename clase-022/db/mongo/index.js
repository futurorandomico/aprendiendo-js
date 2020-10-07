const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/aprendiendo-js', { useUnifiedTopology: true, useNewUrlParser: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Estamos conectados a MongoDB')
})

module.exports = db
