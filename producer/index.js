const app = require('./config/express')();
const port = app.get('port');

global.topic = 'test-topic'
global.clientId = 'my-app'

const sendWithStream = require('./sendWithStream')
const sendWithoutStream = require('./sendWithoutStream')


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
});


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


// setInterval(() => {
//     console.log(3)
//     sendWithStream()
// }, 10)
// setInterval(() => {
//     console.log(4)
//     sendWithoutStream()
// }, 10)
