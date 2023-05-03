const { Kafka } = require('kafkajs')
const kafka = new Kafka({
  clientId,
  brokers: [
    '10.1.1.16:9092',
    // 'localhost:9092'
  ],
})
const prod = 'Prod1'
// const mongoose = require('../mongoose')

const sendWithoutStream = async () => {
  const { v4: uuidv4 } = require('uuid')
  const transactionalId = uuidv4()
  const t1 = uuidv4()
  const t2 = uuidv4()
  const t3 = uuidv4()

  const producer = kafka.producer({
    transactionalId,
    maxInFlightRequests: 1,
    idempotent: true,
  })

  await producer.connect()

  const message1 = { message: `${prod} without ${t1} - 1`, t1 }
  const message2 = { message: `${prod} without ${t2} - 2`, t2 }
  const message3 = { message: `${prod} without ${t3} - 3`, t3 }

  const messages = [
    { value: JSON.stringify(message1) },
    { value: JSON.stringify(message2) },
    { value: JSON.stringify(message3) }
  ]
  // const response = await mongoose.create(transactionalId)

  producer.send({ topic, messages })

  console.log(prod, 'sendWithoutStream', transactionalId)
}

module.exports = sendWithoutStream
