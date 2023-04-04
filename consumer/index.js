const { Kafka } = require("kafkajs");

const app = require("./config/express")();
const port = app.get("port");
console.log(222, app.get("teste"));

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:8080"],
});

require("./consumer");

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
