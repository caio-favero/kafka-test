const app = require('./config/express')();
const port = app.get('port');
const { Types } = require('mongoose')

global.transactionalId = new Types.ObjectId()
global.topic = 'test-topic'
global.clientId = 'my-app'

const sendWithStream = require('./sendWithStream')
const sendWithoutStream = require('./sendWithoutStream')





app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
});



console.log(port)



app.get('/with', (_, res) => {
    console.log(1, 'with')
    sendWithStream()
    res.sendStatus(201)
})
app.get('/without', (_, res) => {
    console.log(2, 'without')
    sendWithoutStream()
    res.sendStatus(201)
})



// setInterval(() => {
//     console.log(3)
//     sendWithStream()
// }, 3000)
// setInterval(() => {
//     console.log(4)
//     sendWithoutStream()
// }, 3000)
