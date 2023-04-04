const { Kafka } = require('kafkajs')
const kafka = new Kafka({ brokers: ['localhost:9092'] })
const prod = 'Prod2'

const sendWithoutStream = async () => {
  for (i = 1; i <= 10; i++) {
    const { v4: uuidv4 } = require('uuid')
    const transactionalId = uuidv4()

    const producer = kafka.producer({
      transactionalId,
      maxInFlightRequests: 1,
      idempotent: true,
    })

    await producer.connect()

    const message = `${prod} without ${transactionalId}`
    const messages = [{ value: JSON.stringify(message) }]

    producer.send({ topic, messages })

    console.log(prod, 'sendWithoutStream', transactionalId)
  }
}

module.exports = sendWithoutStream
