const mongoose = require('mongoose')

main().catch(err => console.log(err))

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test')
}

const kittySchema = new mongoose.Schema({
  _id: String,
  received: Boolean,
})

const Kitten = mongoose.model('Kitten', kittySchema)

// const silence = new Kitten({ _id: 'Silence' })
// console.log(silence.name) // 'Silence'

module.exports = {
  create: async (_id) => {
    return await Kitten.create({ _id })
  },

  received: async (_id) => {
    return await Kitten.findByIdAndUpdate(_id, { received: true })
  }
}

// https://www.zabbix.com/download?zabbix=5.0&os_distribution=ubuntu&os_versi