const { Kafka } = require('kafkajs')
const kafka = new Kafka({ brokers: ['localhost:9092'] })
const prod = 'Prod2'
const mongoose = require('../mongoose')

const sendWithoutStream = async () => {
  const { v4: uuidv4 } = require('uuid')
  const transactionalId = uuidv4()

  const producer = kafka.producer({
    transactionalId,
    maxInFlightRequests: 1,
    idempotent: true,
  })

  await producer.connect()

  const message = { message: `${prod} without ${transactionalId}`, transactionalId }
  const messages = [{ value: JSON.stringify(message) }]
  // await mongoose.create(transactionalId)
  producer.send({ topic, messages })
  await producer.disconnect()

  console.log(prod, 'sendWithoutStream', transactionalId)
}

module.exports = sendWithoutStream
