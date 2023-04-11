const { Kafka } = require('kafkajs')
const kafka = new Kafka({ brokers: ['localhost:9092'] })
const prod = 'Prod1'
const mongoose = require('../mongoose')

const sendWithoutStream = async () => {
  const { v4: uuidv4 } = require('uuid')
  const transactionalId = uuidv4()
  const t1 = uuidv4()
  const t2 = uuidv4()
  const t3 = uuidv4()

  const producer = kafka.producer({
    createPartitioner: {
      topic,
      partitionMetadata: [
        { partitionId: 1, leader: 1 },
        { partitionId: 2, leader: 2 },
        { partitionId: 0, leader: 0 }
      ],
      message: 'message'
    },
    transactionalId,
    maxInFlightRequests: 1,
    idempotent: true,
  })

  await producer.connect()

  const message1 = { message: `${prod} without ${transactionalId} - 1`, t1 }
  const message2 = { message: `${prod} without ${transactionalId} - 2`, t2 }
  const message3 = { message: `${prod} without ${transactionalId} - 3`, t3 }

  const messages = [
    { partition: 0, value: JSON.stringify(message1) },
    { partition: 1, value: JSON.stringify(message2) },
    { partition: 2, value: JSON.stringify(message3) }
  ]
  const response = await mongoose.create(transactionalId)

  producer.send({ topic, messages })

  console.log(prod, 'sendWithoutStream', transactionalId)
}

module.exports = sendWithoutStream
