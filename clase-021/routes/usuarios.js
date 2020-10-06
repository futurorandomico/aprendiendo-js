const express = require('express')
const router = express.Router()
const Usuario = require('../db/mongo/usuario')

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

router.post('/', async (req, res) => {
  try {
    const newUser = new Usuario(req.body)
    // TODO: Generar una password random
    // TODO: Encriptar esa password
    // TODO: Poder armar un login con JWT con este user/password
    // TODO: Armar middleware de validacion de JWT
    await newUser.save()
    res.status(200).send({ ok: true, user: newUser })
  } catch (error) {
    res.status(400).send({ ok: false, error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const query = req.query || {}
    query.deletedAt = null
    if (req.query.showDeleted) {
      query.deletedAt = { $ne: null }
      delete query.showDeleted
      delete req.query.showDeleted
    }
    const usuarios = await Usuario.find(query)
    // TODO: Ver queries mas complejas
    res.status(200).send({ ok: true, usuarios })
  } catch (error) {
    res.status(400).send({ ok: false, error: error.message })
  }
})

router.get([
  '/:id',
  '/id/:id',
  '/username/:username'
], async (req, res) => {
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

router.put([
  '/:id',
  '/id/:id',
  '/username/:username'
], async (req, res) => {
  // Escenario 1
  // const id = req.params.id
  // const usuario = await Usuario.findOneAndUpdate({ _id: id }, req.body, { new: true, overwrite: true })
  // res.status(200).send({ ok: true, usuario })

  // Escenario 2
  if (req.usuario) {
    // No reemplaza completamente al usuario aun... recorrer el Schema y borrar
    Object.keys(req.body).forEach(prop => {
      req.usuario[prop] = req.body[prop]
    })
    await req.usuario.save()
    res.status(200).send({ ok: true, usuario: req.usuario })
  } else {
    throw new Error('Usuario no encontrado')
  }
})

router.patch([
  '/:id',
  '/id/:id',
  '/username/:username'
], async (req, res) => {
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
  if (req.usuario) {
    Object.keys(req.body).forEach(prop => {
      req.usuario[prop] = req.body[prop]
    })
    await req.usuario.save()
    res.status(200).send({ ok: true, usuario: req.usuario })
  } else {
    throw new Error('Usuario no encontrado')
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

module.exports = router
