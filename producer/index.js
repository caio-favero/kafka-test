const app = require('./config/express')()
const port = app.get('port')

global.topic = 'test-topic'
global.clientId = 'Producer1'

const sendWithStream = require('./sendWithStream')
const sendWithoutStream = require('./sendWithoutStream')
const { createPartition, createTopic, listTopics, listPartitions, listGroups } = require('./admin')
const interval = 1000

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})

app.get('/with', (_, res) => {
  try {
    sendWithStream()
    res.sendStatus(201)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get('/without', (_, res) => {
  try {
    sendWithoutStream()
    res.sendStatus(201)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get('/topic', async (_, res) => {
  try {
    const response = await listTopics()
    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get('/partition', async (_, res) => {
  try {
    const response = await listPartitions()
    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get('/group', async (_, res) => {
  try {
    const response = await listGroups()
    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

// POST
app.post('/partition/:partition', async (req, res) => {
  try {
    const response = await createPartition(topic, req.params.partition)
    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.post('/topic/:topic', async (req, res) => {
  try {
    const response = await createTopic(req.params.topic)
    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Isso serve para testar um stream infinito de mensagens a serem enviadas para os tópicos a serem testados

// setInterval(() => {
//   sendWithStream()
// }, interval)
setInterval(() => {
  sendWithoutStream()
}, interval)
