const express = require('express')
const got = require('got')
const router = express.Router()
const configTelegram = require('../../common/config.telegram')
const telegramBase = `https://api.telegram.org/bot${configTelegram.botToken}`
const ngrokBase = 'https://9157c2fbecef.ngrok.io'
const options = { responseType: 'json' }

router.post('/webhook', async (req, res) => {
  console.log(req.headers)

  const message = req.body.message
  const sendMessageTelegramURL = `${telegramBase}/sendMessage`
  const sendMessage = {
    json: {
      chat_id: message.chat.id,
      text: `Eco: ${message.text}`
    }
  }
  const sendMessageOptions = Object.assign({}, options, sendMessage)
  await got.post(sendMessageTelegramURL, sendMessageOptions)

  res.status(200).send({ ok: true })
})

router.get('/setwebhook', async (req, res) => {
  const setWebhookBody = { url: `${ngrokBase}/telegram/webhook` }
  const setWebhook = {
    json: setWebhookBody
  }
  const setWebhookOptions = Object.assign({}, options, setWebhook)
  await got.post(`${telegramBase}/setWebhook`, setWebhookOptions)
  res.status(200).send({ ok: true })
})

module.exports = router
