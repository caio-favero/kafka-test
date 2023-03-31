const { Kafka } = require('kafkajs')
const { Types } = require('mongoose')

const kafka = new Kafka({
    clientId: clientId,
    brokers: ['localhost:9092'],
})

const sendWithoutStream = async () => {
    for (i = 1; i <= 10; i++) {
        const { v4: uuidv4 } = require('uuid')
        const transactionalId = uuidv4()

        const producer = kafka.producer({
            transactionalId: transactionalId,
            maxInFlightRequests: 1,
            idempotent: true,
        })

        await producer.connect()

        console.log(0, 'sendWithoutStream')
        const message = `without ${i} ${transactionalId}`
        const messages = [{ value: JSON.stringify(message) }]

        producer.send({ topic, messages })
    }
}

module.exports = sendWithoutStream
