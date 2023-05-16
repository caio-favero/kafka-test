const { KafkaConsumer, KafkaProducer, KafkaAdmin } = require('../55tec_messaging_lib')
const app = require('./config/express')()
const { v4 } = require('uuid')

const topico = v4()

console.log('topic => ', topico)

function teste1(params) {
  console.log('fun1', params)
}
function teste2(params) {
  console.log('fun2', params)
};







try {
  const admin = new KafkaAdmin()
  admin.registerTopics([topico, `${topico}1`, `${topico}2`])
} catch (err) {
  console.log(3, err)
}






// // servico A
// producer.sendMessage('buscandoInfo', JSON.stringify({ nome: 'nome', idade: 27 }))
// consumer.startConsumer(['devolveInfo', maisCallback])

// // servico B
// consumer.startConsumer(['buscandoInfo'], executaCallback)
// producer.sendMessage('devolveInfo', 'mais mensagem')




setTimeout(() => {


  const consumer = new KafkaConsumer({ groupId: v4(), fromBeginning: false })
  // try {
  consumer.startConsumer([topico, `${topico}1`], teste1)
  consumer.startConsumer([`${topico}2`], teste2)
  // } catch (err) {
  //   console.log(22, err)
  // }















  const producer = new KafkaProducer()

  // try {
  // producer.sendMessage(topico, 'mensagem')
  // producer.sendMessage('topico1', 'mais mensagem', { useStream: true, fromBeginning: true })
  // producer.sendMessage('topico2', 'outra mensagem')
  // } catch (err) {
  //   console.log(11, err)
  // }





















  app.listen(9876, () => {
    console.log(`Servidor rodando na porta ${9876}`)
  })

  app.post('/message', (_, res) => {
    producer.sendMessage(topico, 'mensagem')
    producer.sendMessage(`${topico}1`, 'mais mensagem', { useStream: true })
    producer.sendMessage(`${topico}2`, 'outra mensagem')

    res.sendStatus(200)
  })






  setInterval(() => {
    producer.sendMessage(topico, 'mensagem')
    producer.sendMessage(`${topico}1`, 'mais mensagem', { useStream: true })
    producer.sendMessage(`${topico}2`, 'outra mensagem', { useStream: true })
    console.log('\n')
  }, 10000);
}, 1000);
