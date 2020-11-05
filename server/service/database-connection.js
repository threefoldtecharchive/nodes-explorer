const redis = require('redis')

const client = redis.createClient()

async function healthCheck () {
  return client.connected
}

module.exports = {
  client,
  healthCheck
}
