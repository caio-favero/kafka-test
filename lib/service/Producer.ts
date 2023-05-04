import { Kafka, Producer } from 'kafkajs'
import { v4 } from 'uuid'

const { KAFKA_clientId, KAFKA_brokers } = process.env

interface iOptions {
  useStream: boolean
  maxInFlightRequests: number
  transactionalId: string
  idempotent: boolean
  clientId: string | undefined
  brokers: string[] | undefined

}

export default class KafkaProducer {
  private producer: Producer
  private options: iOptions
  private topic: string
  private message: string

  constructor(options?: iOptions) {
    this.setDefaultOptions(options)


    this.producer = this.createProducer()
  }

  private setDefaultOptions(options?: iOptions) {
    this.options = {
      useStream: false,
      maxInFlightRequests: 1,
      transactionalId: v4(),
      idempotent: true,
      clientId: KAFKA_clientId,
      brokers: KAFKA_brokers?.split(','),
    }

    this.options = { ...this.options, ...options }
  }

  private async start(): Promise<void> {
    try {
      await this.producer.connect()
    } catch (error) {
      console.log('Error connecting the producer: ', error)
    }
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect()
  }

  public async sendMessage(topic: string, message: string, options?: iOptions) {
    this.topic = topic
    this.message = message


    if (options?.useStream) {
      this.sendWithStream()
    } else {
      this.sendWithoutStream()
    }
  }

  private async sendWithStream() {
    await this.producer.connect()
    const transaction = await this.producer.transaction()
    const message = { message: [this.message] }
    const messages = [{ value: JSON.stringify(message) }]

    try {
      await transaction.send({ topic: this.topic, messages })
      await transaction.commit()
    } catch (err) {
      await transaction.abort()
    }
  }

  private async sendWithoutStream() {
    await this.producer.connect()
    const message = { message: [this.message] }
    const messages = [{ value: JSON.stringify(message) }]

    this.producer.send({ topic: this.topic, messages })
  }

  private createProducer(): Producer {
    const kafka = new Kafka({
      clientId: this.options.clientId,
      brokers: this.options.brokers as string[],
    })

    return kafka.producer({
      transactionalId: this.options.transactionalId,
      maxInFlightRequests: this.options.maxInFlightRequests,
      idempotent: this.options.idempotent,
    })
  }
}
