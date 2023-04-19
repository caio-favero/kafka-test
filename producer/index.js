const app = require('./config/express')()
const port = app.get('port')

global.topic = 'test-topic'
global.clientId = 'Producer1'

const sendWithStream = require('./sendWithStream')
const sendWithoutStream = require('./sendWithoutStream')
const interval = 10000

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})

app.use(require('./routes.js'))

// Isso serve para testar um stream infinito de mensagens a serem enviadas para os tópicos a serem testados

setInterval(() => {
  console.log('\n\n')
  sendWithStream()
}, interval)
// setInterval(() => {
//   console.log('\n\n')
//   sendWithoutStream()
// }, interval)
