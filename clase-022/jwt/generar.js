const fs = require('fs')
const jwt = require('jsonwebtoken')
// const { password } = require('./password')
const privateKey = fs.readFileSync('key.private')
const informacionDeSesion = {
  nombre: 'Sebastian',
  rol: 'Administrador'
}
const token = jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data: informacionDeSesion
// }, password)
}, privateKey, { algorithm: 'RS256' })
console.log(token)
