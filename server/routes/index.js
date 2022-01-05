const express = require('express')
const httpError = require('http-errors')
const router = express.Router()
const { client } = require('../service/database-connection')
const { validateURL, validateNetwork } = require('../middleware/validate')
const { getItems } = require('../controllers/directory')
const { computeNodeStats, appendV3NodeStats } = require('../controllers/stats')
const { getPrices } = require('../controllers/prices')

router.get('/health', (req, res, next) => {
  res.status(200).send('up')
})

router.get('/*', validateURL, validateNetwork, (req, res, next) => {
  client.get(req.url, (err, result) => {
    if (err) {
      console.log(err)
      throw httpError(500, err)
    }
    if (result) {
      return res.status(200).json(JSON.parse(result))
    } else {
      if (req.type === 'prices') {
        return getPrices(req.type, req.network)
          .then(response => {
            client.setex(req.url, 600, JSON.stringify(response.data))
            res.send(response.data)
          })
      }
      getItems(req.network, req.type)
        .then(async data => {
          if (req.type === 'stats') {
            // Here we compute the stats and adding the grid3 stats also.
            let stats = computeNodeStats(data)
            await appendV3NodeStats(stats, req.network)
            client.setex(req.url, 600, JSON.stringify(stats))
            res.send(stats)
          } else {
            client.setex(req.url, 600, JSON.stringify(data))
            res.send(data)
          }
        })
        .catch(next)
    }
  })
})

module.exports = router
