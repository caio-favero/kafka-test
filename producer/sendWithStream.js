const { Kafka } = require('kafkajs')
const prod = 'Prod1'
const mongoose = require('../mongoose')

const kafka = new Kafka({
  clientId: clientId,
  brokers: ['localhost:9092'],
})

const sendWithStream = async () => {
  const { v4: uuidv4 } = require('uuid')
  const transactionalId = uuidv4()

  const producer = kafka.producer({
    // createPartitioner: {
    //   topic: 'topic',
    //   partitionMetadata: [
    //     { partitionId: 1, leader: 1 },
    //     { partitionId: 2, leader: 2 },
    //     { partitionId: 0, leader: 0 }
    //   ],
    //   message: 'message'
    // },
    transactionalId,
    maxInFlightRequests: 1,
    idempotent: true,
  })

  await producer.connect()

  const message = { message: `${prod} with ${transactionalId}`, transactionalId }
  const messages = [{ partition: 1, value: JSON.stringify(message) }]

  const transaction = await producer.transaction()

  try {
    await transaction.send({ topic, messages })
    await transaction.commit()
    await mongoose.create(transactionalId)

    console.log(prod, 'sendWithStream', transactionalId)
  } catch (err) {
    console.log('err1 ====> ', err)
    await transaction.abort()
  }

  return

}

module.exports = sendWithStream
