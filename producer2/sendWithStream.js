const { Kafka, Partitioners } = require('kafkajs')
const prod = 'Prod2'
const mongoose = require('../mongoose')
const fs = require('fs')

const kafka = new Kafka({
  clientId: clientId,
  brokers: ['10.1.1.16:9092'],
  ssl: {
    rejectUnauthorized: false,
    ca: [fs.readFileSync('./ca.crt', 'utf-8')],
    key: fs.readFileSync('./client-key.pem', 'utf-8'),
    cert: fs.readFileSync('./client-cert.pem', 'utf-8')
  },
  // sasl: {
  //   mechanism: 'plain',
  //   username: 'kafka',
  //   password: '@55Pbx#Klaus'
  // },
})

const sendWithStream = async () => {
  const { v4: uuidv4 } = require('uuid')
  const transactionalId = uuidv4()

  const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
    // transactionalId,
    maxInFlightRequests: 1,
    idempotent: true,
  })

  await producer.connect()

  const message = { message: `${prod} with ${transactionalId}`, transactionalId }
  const messages = [{ value: JSON.stringify(message) }]

  const transaction = await producer.transaction()

  try {
    await transaction.send({ topic, messages })
    await transaction.commit()
    await producer.disconnect()

    // await mongoose.create(transactionalId)

    console.log(prod, 'sendWithStream', transactionalId)
  } catch (err) {
    console.log('err1 ====> ', err)
    await transaction.abort()
  }

  return
}

module.exports = sendWithStream
