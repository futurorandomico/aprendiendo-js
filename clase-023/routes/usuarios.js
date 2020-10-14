const express = require('express')
const router = express.Router()
const Usuario = require('../db/mongo/usuario')
const randToken = require('rand-token')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const privateKey = fs.readFileSync(path.join(__dirname, '..', 'jwt', 'key.private'))
const { auth, roles } = require('../middlewares/auth')

router.param('id', async (req, res, next, id) => {
  const usuario = await Usuario.findById(id)
  req.usuario = usuario
  next()
})

router.param('username', async (req, res, next, username) => {
  const usuario = await Usuario.findOne({ username })
  req.usuario = usuario
  next()
})

router.post('/', auth, roles('usuarios:crear'), async (req, res) => {
  try {
    const newUser = new Usuario(req.body)
    let randomPassword = null
    if (!newUser.password) {
      randomPassword = randToken.generate(10)
      newUser.password = randomPassword
    }
    await newUser.save()
    const toReturn = newUser.toObject()
    delete toReturn.password
    if (randomPassword) {
      toReturn.randomPassword = randomPassword
    }
    res.status(200).send({ ok: true, user: toReturn })
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).send({ ok: false, error: error.message })
    }
  }
})

router.get('/', auth, roles('usuarios:listar'), async (req, res) => {
  try {
    const query = {
      deletedAt: null
    }
    if (req.query.showDeleted) {
      query.deletedAt = { $ne: null }
    }
    if (req.query.username) {
      query.username = req.query.username
    }
    if (req.query.creadoDespuesDe) {
      query.createdAt = { $gte: req.query.creadoDespuesDe } // $gt, $lte, $lt
    }
    const usuarios = await Usuario.find(query)
    res.status(200).send({ ok: true, usuarios })
  } catch (error) {
    res.status(400).send({ ok: false, error: error.message })
  }
})

router.get([
  '/:id',
  '/id/:id',
  '/username/:username'
], auth, roles('usuarios:listarUno'), async (req, res) => {
  try {
    // Escenario 0
    // const usuario = await Usuario.findOne({ _id: id })

    // Escenario 1
    // const id = req.params.id
    // const usuario = await Usuario.findById(id)

    // Escenario 2
    if (req.usuario) {
      res.status(200).send({ ok: true, usuario: req.usuario })
    } else {
      res.status(404).send({ ok: false })
    }
  } catch (error) {
    res.status(400).send({ ok: false, error: error.message })
  }
})

// router.put([
//   '/:id',
//   '/id/:id',
//   '/username/:username'
// ], async (req, res) => {
//   // Escenario 1
//   // const id = req.params.id
//   // const usuario = await Usuario.findOneAndUpdate({ _id: id }, req.body, { new: true, overwrite: true })
//   // res.status(200).send({ ok: true, usuario })

//   // Escenario 2
//   if (req.usuario) {
//     // No reemplaza completamente al usuario aun... recorrer el Schema y borrar
//     Object.keys(req.body).forEach(prop => {
//       req.usuario[prop] = req.body[prop]
//     })
//     await req.usuario.save()
//     res.status(200).send({ ok: true, usuario: req.usuario })
//   } else {
//     throw new Error('Usuario no encontrado')
//   }
// })

router.patch([
  '/:id',
  '/id/:id',
  '/username/:username'
], auth, roles('usuarios:modificar'), async (req, res) => {
  // Escenario 1
  // const id = req.params.id
  // // Object.keys(req.body).forEach(prop => {
  // //   if (req.body[prop] === '') {
  // //     req.body[prop] = undefined
  // //   }
  // // })
  // const usuario = await Usuario.findOneAndUpdate({ _id: id }, req.body, { new: true, omitUndefined: true })
  // res.status(200).send({ ok: true, usuario })

  // Escenario 2
  try {
    if (req.usuario) {
      Object.keys(req.body).forEach(prop => {
        if (prop !== 'intereses') {
          req.usuario[prop] = req.body[prop]
        } else {
          throw new Error('Usuario no permite modificar intereses por API REST. Por favor use /:id/intereses.')
        }
      })
      await req.usuario.save()
      const toReturn = req.usuario.toObject()
      delete toReturn.password
      res.status(200).send({ ok: true, usuario: toReturn })
    } else {
      throw new Error('Usuario no encontrado')
    }
  } catch (error) {
    res.status(400).send({ ok: false, error: error.message })
  }
})

router.post([
  '/:id/intereses',
  '/id/:id/intereses',
  '/username/:username/intereses'
], async (req, res) => {
  try {
    if (req.usuario) {
      if (!req.usuario.intereses) {
        req.usuario.intereses = []
      }
      req.usuario.intereses.push(req.body)
      await req.usuario.save()
      res.status(200).send({ ok: true, usuario: req.usuario })
    } else {
      throw new Error('Usuario no encontrado')
    }
  } catch (error) {
    res.status(400).send({ ok: false, error: error.message })
  }
})

router.delete([
  '/:id/intereses',
  '/id/:id/intereses',
  '/username/:username/intereses'
], async (req, res) => {
  try {
    if (req.usuario) {
      if (!req.usuario.intereses) {
        req.usuario.intereses = []
      }
      const interesABorrar = req.body.nombre
      req.usuario.intereses = req.usuario.intereses.filter(interes => interes.nombre !== interesABorrar)
      await req.usuario.save()
      res.status(200).send({ ok: true, usuario: req.usuario })
    } else {
      throw new Error('Usuario no encontrado')
    }
  } catch (error) {
    res.status(400).send({ ok: false, error: error.message })
  }
})

router.delete([
  '/intereses'
], async (req, res) => {
  try {
    // const usuarios = await Usuario.find({ intereses: { $elemMatch: { nombre: req.body.nombre } } })
    // for (let index = 0; index < usuarios.length; index++) {
    //   const usuario = usuarios[index]
    //   usuario.intereses = usuario.intereses.filter(interes => interes.nombre !== req.body.nombre)
    //   await usuario.save()
    // }

    const usuarios = await Usuario.find({ intereses: { $elemMatch: { nombre: req.body.nombre } } }).cursor()
    for (let usuario = await usuarios.next(); usuario != null; usuario = await usuarios.next()) {
      usuario.intereses = usuario.intereses.filter(interes => interes.nombre !== req.body.nombre)
      await usuario.save()
    }

    res.status(200).send({ ok: true })
  } catch (error) {
    console.log(error)
    res.status(400).send({ ok: false, error: error.message })
  }
})

router.delete([
  '/:id',
  '/id/:id',
  '/username/:username'
], async (req, res) => {
  // const id = req.params.id

  // Borrado fisico
  // await Usuario.deleteOne({ _id: id })

  // Borrado logico
  // const usuario = await Usuario.findById(id)
  // usuario.deletedAt = new Date()
  // await usuario.save()

  if (req.usuario) {
    req.usuario.deletedAt = new Date()
    await req.usuario.save()
  }

  res.status(200).send({ ok: true })
})

router.post('/login', async (req, res) => {
  try {
    if (req.body.username && req.body.password) {
      const usuario = await Usuario.findOne({ username: req.body.username, deletedAt: null })
      if (usuario) {
        const resultado = await usuario.laPasswordEsValida(req.body.password)
        if (resultado === true) {
          const informacionDeSesion = {
            _id: usuario._id,
            username: usuario.username,
            roles: usuario.roles
          }
          const expireAt = Math.floor(Date.now() / 1000) + (60 * 60)
          const token = jwt.sign({
            exp: expireAt,
            data: informacionDeSesion
          }, privateKey, { algorithm: 'RS256' })

          res.status(200).send({ ok: true, token, expireAt })
        } else {
          throw new Error('Contraseña no es correcta')
        }
      } else {
        throw new Error('Usuario no encontrado')
      }
    } else {
      throw new Error('Debes enviarme username y password')
    }
  } catch (error) {
    res.status(400).send({ ok: false, error: error.message })
  }
})

module.exports = router
