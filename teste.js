const { KafkaConsumer, KafkaProducer } = require('./lib')

const consumer = new KafkaConsumer()
consumer.startConsumer

const producer = new KafkaProducer()
producer.sendMessage()
