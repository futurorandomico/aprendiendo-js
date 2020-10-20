const Redis = require('ioredis')
const redis = new Redis({ lazyConnect: true })
// redis.on('connect', _ => {
//   console.log('me conecte a redis')
// })

;(async () => {
  try {
    // const obj = {
    //   foo: 'bar',
    //   variable: true,
    //   otroDato: 3
    // }
    const obj = [
      'bar',
      3,
      true,
      new Date(),
      /hola/
    ]
    console.log(obj)
    const result = await redis.set('foo', JSON.stringify(obj))
    console.log(result)
    const data = await redis.get('foo')
    const objBack = JSON.parse(data)
    console.log(objBack, typeof objBack)
  } catch (e) {
    console.log(e)
  } finally {
    redis.disconnect()
  }
})()
