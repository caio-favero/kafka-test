const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
})

const producer = kafka.producer({
    transactionalId: require('uuidv4').uuid(),
    maxInFlightRequests: 1,
    idempotent: true,
})

const sendWithStream = async () => {
    await producer.connect()

    for (i = 1; i <= 10; i++) {
        const message = `with ${i} ${transactionalId}`
        const messages = [{ value: JSON.stringify(message) }]

        const transaction = await producer.transaction()

        try {
            console.log(0, 'sendWithStream')
            await transaction.send({ topic, messages })

            await transaction.commit()
        } catch (e) {
            console.log('err1 ====> ', e)
            await transaction.abort()
        }
    }
    return

}

module.exports = sendWithStream
