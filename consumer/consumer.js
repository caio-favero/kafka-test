const { Kafka } = require("kafkajs")
const topics = ["test-topic"]
const mongoose = require('../mongoose')

const kafka = new Kafka({
  clientId: 'Consumer1',
  brokers: ["localhost:9092"],
})

const consumer = kafka.consumer({ groupId: "test-group1" })

const createConsumer = async () => {
  try {
    await consumer.connect()
    await consumer.subscribe({ topics, fromBeginning: true })
    consumer.run({
      partitionsConsumedConcurrently: 3,
      eachMessage: async ({ topic, partition, message }) => {
        console.log(topic, partition, JSON.parse(message.value).message)
        await mongoose.received(JSON.parse(message.value).transactionalId)
      },
    })
    consumer.commitOffsets([
      { topic: topics[0], partition: 0, offset: '31004', high: '31004', low: '421' },
      { topic: topics[0], partition: 1, offset: '54312', high: '54312', low: '3102' },
      { topic: topics[0], partition: 2, offset: '32103', high: '32103', low: '518' }
    ])
  } catch (error) {
    console.log('error =>', err)
  }
}

createConsumer()
