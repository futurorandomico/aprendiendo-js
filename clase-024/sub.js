const Redis = require('ioredis')
const redis = new Redis()

;(async () => {
  try {
    await redis.subscribe('aprendiendo.js')
    redis.on('message', function (channel, message) {
      console.log(`Recibi un mensaje "${message}" del canal ${channel}`)
    })
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 60000)
    })
  } catch (e) {
    console.log(e)
  } finally {
    redis.disconnect()
  }
})()
