const { Kafka } = require('kafkajs')
const topic = 'test-topic'

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
})

const consumer = kafka.consumer({ groupId: 'test-group' })

Promise.resolve(consumer.connect())
    .then(() => {
        return consumer.subscribe({ topic, fromBeginning: true })
    })
    .then(() => {
        consumer.subscribe({ topic, fromBeginning: true })
    })
    .then(() => {
        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                // console.log(message.value.toString())
            },
        })
    })
    .catch(e => {
        console.log('err', e)
    })
