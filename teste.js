const { KafkaConsumer, KafkaProducer, KafkaAdmin } = require('../55tec_messaging_lib')
const app = require('./config/express')()
const { v4 } = require('uuid')

const brokers = ['10.1.1.16:9092','10.1.1.16:9192','10.1.1.16:9292','127.0.0.1:9092','127.0.0.1:9192','127.0.0.1:9292']

const topico = 'abcdefghk'

console.log('topic =>', topico)

function teste1(params) {
  console.log('fun1', params)
}
function teste2(params) {
  console.log('fun2', params)
}


// ADMIN
try {
  const admin = new KafkaAdmin({brokers})

  // admin.registerTopics([topico])
  admin.registerTopics([topico, `${topico}1`, `${topico}2`])
} catch (err) {
  console.log(3, err)
}




// setTimeout(() => {
// const consumer = new KafkaConsumer({ groupId: v4(),fromBeginning:true ,brokers})
// const producer = new KafkaProducer({brokers})



// consumer.startConsumer([topico, `${topico}1`], teste1)
// consumer.startConsumer([`${topico}2`], teste2)




// //   app.listen(9876, () => {
// //     console.log(`Servidor rodando na porta ${9876}`)
// //   })

// //   app.post('/message', (_, res) => {
//     producer.sendMessage(topico, 'mensagem')
//     // producer.sendMessage(`${topico}1`, 'mais mensagem', { useStream: true })
// //     producer.sendMessage(`${topico}2`, 'outra mensagem')

// //     res.sendStatus(200)
// //   })






//   setInterval(() => {
//     producer.sendMessage(topico, 'mensagem')
//     producer.sendMessage(`${topico}1`, 'mais mensagem', { useStream: true })
//     producer.sendMessage(`${topico}2`, 'outra mensagem')
//     console.log('\n')
//   }, 10000);


// }, 1000);
