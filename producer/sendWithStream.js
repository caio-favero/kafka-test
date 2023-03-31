const { Kafka } = require('kafkajs')
const { Types } = require('mongoose')


const kafka = new Kafka({
    clientId: clientId,
    brokers: ['localhost:9092'],
})

const sendWithStream = async () => {
    for (i = 1; i <= 10; i++) {
        const { v4: uuidv4 } = require('uuid')
        const transactionalId = uuidv4()

        const producer = kafka.producer({
            transactionalId: transactionalId,
            maxInFlightRequests: 1,
            idempotent: true,
        })

        await producer.connect()

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
