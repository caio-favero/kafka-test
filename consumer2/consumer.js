const { Kafka } = require("kafkajs");
const topics = ["test-topic"];
// const mongoose = require("../mongoose");

const kafka = new Kafka({
  clientId: "Consumer2",
  brokers: [
    // '10.1.1.16:9092',
    'localhost:9092'
  ],
});

const consumer = kafka.consumer({ groupId: "test-group1" });

const createConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topics, fromBeginning: true });
    consumer.run({
      partitionsConsumedConcurrently: 3,
      autoCommit: false,
      // eachBatch: async ({ batch: { topic, partition, messages } }) => {
      //   console.log('\n')
      //   console.log('Batch', topic, partition, JSON.parse(messages));
      // },
      eachMessage: async ({ topic, partition, message }) => {
        console.log('\n')
        console.log('Message', topic, partition, JSON.parse(message.value).message);
        // await mongoose.received(JSON.parse(message.value).transactionalId);
      },
    });
  } catch (error) {
    console.log("error =>", error);
  }
};

createConsumer();
