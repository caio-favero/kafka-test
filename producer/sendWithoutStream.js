const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: clientId,
    brokers: ['localhost:9092'],
})

const producer = kafka.producer({
    transactionalId: transactionalId,
    maxInFlightRequests: 1,
    idempotent: true,
})

const sendWithoutStream = async () => {
    await producer.connect()

    for (i = 1; i <= 10; i++) {
        console.log(0, 'sendWithoutStream')
        const message = `without ${i} ${transactionalId}`
        const messages = [{ value: JSON.stringify(message) }]

        producer.send({ topic, messages })
    }
}

module.exports = sendWithoutStream
