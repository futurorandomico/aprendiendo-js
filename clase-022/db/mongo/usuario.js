const mongoose = require('mongoose')

const usuariosSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // unique: true,
    // match: new RegExp('(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))')
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: { type: String },
  nombre: { type: String },
  apellido: { type: String },
  intereses: {
    type: [
      new mongoose.Schema({
        nombre: { type: String },
        grado: { type: Number, min: 0, max: 100 }
      }, {
        _id: false,
        versionKey: false
      })
    ],
    default: undefined
  },
  roles: {
    type: [
      new mongoose.Schema({
        nombre: { type: String }
      }, {
        _id: false,
        versionKey: false
      })
    ],
    default: undefined
  },
  dni: { type: String, required: true },
  sexo: { type: String, required: true, enum: ['M', 'F'] },
  genero: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
}, {
  // _id: false,
  versionKey: false
})

usuariosSchema.pre('save', function (next) {
  const now = new Date()
  if (!this.createdAt) {
    this.createdAt = now
  }
  this.updatedAt = now
  next()
})

usuariosSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const now = new Date()
  const update = this.getUpdate()
  // update.createdAt = undefined
  update.updatedAt = now
  next()
})

usuariosSchema.index({ username: 1 }, { unique: true })
usuariosSchema.index({ dni: 1, sexo: 1 }, { unique: true })
// usuariosSchema.index({ 'intereses': 1 })
// usuariosSchema.index({ 'roles': 1 })
usuariosSchema.index({ 'intereses.nombre': 1 })
usuariosSchema.index({ genero: 1 })
// usuariosSchema.index({ 'intereses.grado': 1 })

const Usuario = mongoose.model('Usuarios', usuariosSchema)

module.exports = Usuario
