const { Kafka } = require("kafkajs");

const app = require("./config/express")();
const port = app.get("port");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:8080"],
});

require("./consumer");

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
