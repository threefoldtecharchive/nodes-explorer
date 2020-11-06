const httpError = require('http-errors')

function validateNetwork (req, res, next) {
  const { query } = req
  const allowedNetworks = ['mainnet', 'testnet', 'devnet', 'all']

  let network = query.network || 'all'
  network = network.toLowerCase()

  if (!allowedNetworks.includes(network)) {
    next(httpError(400, `query ${network} not allowed, only ${allowedNetworks} are valid.`))
  }

  req.network = network
  next()
}

function validateURL (req, res, next) {
  const { path } = req
  const allowedPaths = ['nodes', 'gateways', 'farms', 'stats']
  const splittedPath = path.split('/')

  if (splittedPath.length < 2) {
    next(httpError(400))
  }

  if (!allowedPaths.includes(splittedPath[1])) {
    next(httpError(400, `path ${splittedPath[1]} not allowed, only ${allowedPaths} are valid.`))
  }

  req.type = splittedPath[1]
  next()
}

module.exports = {
  validateNetwork,
  validateURL
}
