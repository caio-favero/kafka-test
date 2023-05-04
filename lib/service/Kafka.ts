import { Kafka } from 'kafkajs'
import { v4 } from 'uuid'

const { KAFKA_clientId, KAFKA_brokers } = process.env

interface iOptions {
  useStream: boolean
  maxInFlightRequests: number
  transactionalId: string
  idempotent: boolean
}

class KafkaMessaging {
  clientId: string
  brokers: [string]
  options: iOptions
  kafkaInstance: Kafka

  constructor(clientId: string, brokers: [string], options?: iOptions) {
    this.setDefaultOptions()

    this.clientId = clientId ?? KAFKA_clientId;
    this.brokers = brokers ?? KAFKA_brokers;
    this.options = { ...this.options, ...options }

    this.startUp()
  }

  async startUp() {
    this.kafkaInstance = new Kafka({
      clientId: this.clientId,
      brokers: this.brokers,
    })
  }

  setDefaultOptions() {
    this.options = {
      useStream: false,
      maxInFlightRequests: 1,
      transactionalId: v4(),
      idempotent: true,
    }
  }

}

class Producer extends KafkaMessaging {
  message: string
  topic: string

  constructor(clientId: string, brokers: [string], options?: iOptions) {
    super(clientId, brokers, options)
  }

    async sendMessage(topic: string, message: string, options?: iOptions) {
      this.topic = topic
      this.message = message
      const producer = this.kafkaInstance.producer({
        transactionalId: this.options.transactionalId,
        maxInFlightRequests: this.options.maxInFlightRequests,
        idempotent: this.options.idempotent,
      })

      if (options?.useStream) {
        this.sendWithStream(producer)
      } else {
        this.sendWithoutStream(producer)
      }
    }

    async sendWithStream(producer) {
      await producer.connect()
      const transaction = await producer.transaction()
      const messages = { message: [this.message] }

      try {
        await transaction.send({ topic: this.topic, messages })
        await transaction.commit()
        // await producer.disconnect()


      } catch (err) {

        await transaction.abort()
      }
    }

    async sendWithoutStream(producer) {

    }
}

class Consumer extends KafkaMessaging {
  constructor(clientId: string, brokers: [string], options?: iOptions) {
    super(clientId, brokers, options)
  }
}

export { Producer, Consumer }
