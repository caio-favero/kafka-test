const { Kafka } = require("kafkajs");
const topic = "test-topic";
const mongoose = require('../mongoose')

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "test-group" });

const createConsumer = async () => {
  try {
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {

        console.log(topic, JSON.parse(message.value).message)
        await mongoose.received(JSON.parse(message.value).transactionalId)
      },
    })
  } catch (error) {
    console.log('error =>', err)
  }
}

createConsumer()