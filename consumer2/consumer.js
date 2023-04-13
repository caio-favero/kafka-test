const { Kafka } = require("kafkajs");
const topics = ["test-topic", "test-topic2"];
const mongoose = require("../mongoose");

const kafka = new Kafka({
  clientId: "Consumer2",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "test-group2" });

const createConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topics, fromBeginning: true });
    consumer.run({
      partitionsConsumedConcurrently: 3,
      autoCommit: false,
      eachMessage: async ({ topic, partition, message }) => {
        console.log(topic, partition, JSON.parse(message.value).message);
        await mongoose.received(JSON.parse(message.value).transactionalId);
      },
    });
  } catch (error) {
    console.log("error =>", error);
  }
};

createConsumer();
