const fs = require('fs')
const path = require('path')
const express = require('express')
const router = express.Router()
const cors = require('cors')
const basicAuth = require('express-basic-auth')
const jwt = require('jsonwebtoken')
// const { password } = require('../jwt/password')
const publicKey = fs.readFileSync(path.join(__dirname, '..', 'jwt', 'key.public'))

const productos = [
  {
    nombre: 'empanadas',
    valor: 300
  },
  {
    nombre: 'pizza',
    valor: 1300
  },
  {
    nombre: 'faina',
    valor: 5300
  }
]

const chat = (req, res) => {
  res.render('chat')
}

const home = (req, res) => {
  res.render('index')
}

const productosHTML = async (req, res) => {
  const productos = await new Promise((resolve, reject) => {
    setTimeout(_ => {
      resolve()
    }, 3000)
  })
  res.render('productos', { mercadoPago: false, productos })
}

const productosAPI = async (req, res) => {
  res.status(200).send(productos)
}

const autosAPI = async (req, res) => {
  console.log(req.body)
  res.status(200).send(req.body)
}

const corsMiddleware = cors({
  origin: [
    'http://localhost:8080',
    'http://localtest.me:8080'
  ],
  methods: [
    'GET',
    'POST'
  ],
  allowedHeaders: [
    'Authorization',
    'Content-Type'
  ]
})

const basicAuthMiddleware = basicAuth({
  users: {
    admin: 'supersecret'
  }
})

const jwtMiddleware = (req, res, next) => {
  const token = req && req.headers && req.headers['authorization'] && req.headers['authorization'].replace(/^Bearer /, '')
  try {
    const decodedToken = jwt.verify(token, publicKey, { algorithm: 'RS256' }) // ,password
    req.jwt = decodedToken
    next()
  } catch (error) {
    res.status(401).send({ ok: false, error: 'JWT inválido' })
  }
}

router.use('/api/productos', corsMiddleware)
// router.use('/api/productos', basicAuthMiddleware)
router.use('/api/productos', jwtMiddleware)
router.use('/api/autos', corsMiddleware)

router.get('/', home)
router.get('/productos', productosHTML)
router.get('/chat', chat)
router.get('/api/productos', productosAPI)
router.post('/api/autos', autosAPI)

module.exports = router
