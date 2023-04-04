const { Kafka } = require("kafkajs");
const topic = "test-topic";

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
        console.log(topic, message.value.toString())
      },
    })
  } catch (error) {
    console.log('error =>', err)
  }
}

createConsumer()