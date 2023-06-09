const { KAFKA_clientId, KAFKA_brokers } = process.env

import { BrokersFunction, Consumer, ConsumerSubscribeTopics, EachBatchPayload, Kafka, EachMessagePayload } from 'kafkajs'

// interface CustomMessageFormat { a: string }
interface iOptions {
  useStream: boolean
  maxInFlightRequests: number
  transactionalId: string
  idempotent: boolean
  clientId: string | undefined
  brokers: string[] | BrokersFunction
  fromBeginning: boolean // false
}

export default class KafkaConsumer {
  private kafkaConsumer: Consumer
  private options: iOptions
  private topics: string[]
  private groupId: string

  public constructor() {
    this.kafkaConsumer = this.createKafkaConsumer()
  }

  public async startConsumer(callback: Promise<void>): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: this.topics,
      fromBeginning: this.options.fromBeginning
    }

    try {
      await this.kafkaConsumer.connect()
      await this.kafkaConsumer.subscribe(topic)

      await this.kafkaConsumer.run({ eachMessage: async (messagePayload: EachMessagePayload) => callback })
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  public async startBatchConsumer(): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: this.topics,
      fromBeginning: this.options.fromBeginning
    }

    try {
      await this.kafkaConsumer.connect()
      await this.kafkaConsumer.subscribe(topic)
      await this.kafkaConsumer.run({
        eachBatch: async (eachBatchPayload: EachBatchPayload) => {
          const { batch } = eachBatchPayload
          for (const message of batch.messages) {
            const prefix = `${batch.topic}[${batch.partition} | ${message.offset}] / ${message.timestamp}`
            console.log(`- ${prefix} ${message.key}#${message.value}`)
          }
        }
      })
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect()
  }

  private createKafkaConsumer(): Consumer {
    const kafka = new Kafka({
      clientId: this.options.clientId,
      brokers: this.options.brokers,
    })
    const consumer = kafka.consumer({ groupId: this.groupId })
    return consumer
  }
}
