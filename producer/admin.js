const { Kafka } = require('kafkajs')
const kafka = new Kafka({ brokers: ['localhost:9092'] })
const admin = kafka.admin()

const listTopics = async () => {
  await admin.connect()

  const listed = await admin.listTopics()

  await admin.disconnect()

  return listed
}

const createTopic = async (topic) => {
  await admin.connect()

  const created = await admin.createTopics({
    topics: [topic]
  })

  await admin.disconnect()

  return created
}

const createPartition = async (partition) => {
  await admin.connect()

  const created = await admin.createPartitions({
    topicPartitions: [partition],
  })

  await admin.disconnect()

  return created
}

const listPartitions = async () => {
  await admin.connect()

  const listed = await admin.listPartitionReassignments()

  await admin.disconnect()

  return listed
}

const listGroups = async () => {
  await admin.connect()

  const listed = await admin.listGroups()

  await admin.disconnect()

  return listed
}

module.exports = {
  listTopics,
  createTopic,
  listPartitions,
  createPartition,
  listGroups
}