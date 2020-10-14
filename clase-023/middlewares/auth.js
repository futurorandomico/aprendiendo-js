const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const publicKey = fs.readFileSync(path.join(__dirname, '..', 'jwt', 'key.public'))

const auth = async (req, res, next) => {
  const token = req && req.headers && req.headers['authorization'] && req.headers['authorization'].replace(/^Bearer /, '')
  try {
    const decodedToken = jwt.verify(token, publicKey, { algorithm: 'RS256' })
    req.jwt = decodedToken
    next()
  } catch (error) {
    res.status(401).send({ ok: false, error: 'JWT inválido' })
    next(error)
  }
}

const roles = (rolesNecesarios) => {
  return async (req, res, next) => {
    try {
      const rolesJWT = req.jwt.data.roles
      if (rolesJWT && Array.isArray(rolesJWT) && rolesJWT.length) {
        const rolesObtenidos = rolesJWT.filter(rol => rol.nombre === rolesNecesarios)
        if (rolesObtenidos && rolesObtenidos.length) {
          next()
        } else {
          throw new Error('No tienes el rol adecuado para esta llamada')
        }
      } else {
        throw new Error('No tienes roles asignados')
      }
    } catch (error) {
      res.status(401).send({ ok: false, error: error.message })
      next(error)
    }
  }
}

module.exports = {
  auth,
  roles
}
