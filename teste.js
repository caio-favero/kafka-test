const { KafkaConsumer, KafkaProducer } = require('./lib')

const consumer = new KafkaConsumer()
consumer.startConsumer(teste)

const producer = new KafkaProducer()
producer.sendMessage('topico', 'mensagem')

function teste(params) {
console.log(1, params)
}

const app = require('./config/express')()

app.listen(9876, () => {
  console.log(`Servidor rodando na porta ${9876}`)
})



// setInterval(() => {
 
 
// })
 
