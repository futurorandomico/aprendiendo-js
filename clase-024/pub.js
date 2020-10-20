const Redis = require('ioredis')
const redis = new Redis()

;(async () => {
  try {
    await redis.publish('aprendiendo.js', 'Hola @retux!')
  } catch (e) {
    console.log(e)
  } finally {
    redis.disconnect()
  }
})()
