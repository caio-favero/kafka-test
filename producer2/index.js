const app = require('./config/express')()
const port = app.get('port')

global.topic = 'test-topic'
global.clientId = 'Producer2'

const sendWithStream = require('./sendWithStream')
const sendWithoutStream = require('./sendWithoutStream')
const interval = 1000

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})

app.get('/with', (_, res) => {
  console.log('\n\n\n\n', 1, 'with')
  sendWithStream()
  res.sendStatus(201)
})

app.get('/without', (_, res) => {
  console.log('\n\n\n\n', 2, 'without')
  sendWithoutStream()
  res.sendStatus(201)
})

// Isso serve para testar um stream infinito de mensagens a serem enviadas para os tópicos a serem testados

setInterval(() => {
  sendWithStream()
}, interval)
setInterval(() => {
  sendWithoutStream()
}, interval)
