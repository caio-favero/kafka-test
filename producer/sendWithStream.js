const { Kafka } = require('kafkajs')
const prod = 'Prod1'
// const mongoose = require('../mongoose')

const kafka = new Kafka({
  clientId: clientId,
  brokers: ['10.1.1.16:9092', 'localhost:9092'],
  // sasl: {
  //   mechanism: 'plain', // scram-sha-256 or scram-sha-512
  //   username: 'kafka',
  //   password: '@55Pbx#Klaus'
  // },
})

const sendWithStream = async () => {
  const { v4: uuidv4 } = require('uuid')

  const t1 = uuidv4()
  const t2 = uuidv4()
  const t3 = uuidv4()

  const transactionalId = uuidv4()
  const producer = kafka.producer({
    transactionalId,
    maxInFlightRequests: 1,
    idempotent: true,
  })

  await producer.connect()
  const message1 = { message: `${prod} with ${t1} - 1`, t1 }
  const message2 = { message: `${prod} with ${t2} - 2`, t2 }
  const message3 = { message: `${prod} with ${t3} - 3`, t3 }

  const messages = [
    { value: JSON.stringify(message1) },
    { value: JSON.stringify(message2) },
    { value: JSON.stringify(message3) }
  ]

  const transaction = await producer.transaction()

  try {
    await transaction.send({ topic, messages })
    await transaction.commit()
    // await mongoose.create(transactionalId)

    console.log(prod, 'sendWithStream', t1)
    console.log(prod, 'sendWithStream', t2)
    console.log(prod, 'sendWithStream', t3)
  } catch (err) {
    console.log('err1 ====> ', err)
    await transaction.abort()
  }

  return

}

module.exports = sendWithStream
