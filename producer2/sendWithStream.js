const { Kafka } = require('kafkajs')
const prod = 'Prod2'

const kafka = new Kafka({
  clientId: clientId,
  brokers: ['localhost:9092'],
})

const sendWithStream = async () => {
  for (i = 1; i <= 10; i++) {
    const { v4: uuidv4 } = require('uuid')
    const transactionalId = uuidv4()

    const producer = kafka.producer({
      transactionalId,
      maxInFlightRequests: 1,
      idempotent: true,
    })

    await producer.connect()

    const message = `${prod} with ${transactionalId}`
    const messages = [{ value: JSON.stringify(message) }]

    const transaction = await producer.transaction()

    try {
      await transaction.send({ topic, messages })
      await transaction.commit()

      console.log(prod, 'sendWithStream', transactionalId)
    } catch (err) {
      console.log('err1 ====> ', err)
      await transaction.abort()
    }
  }
  return

}

module.exports = sendWithStream