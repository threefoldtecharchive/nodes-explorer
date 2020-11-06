const express = require('express')
const httpError = require('http-errors')
const router = express.Router()
const { getItems } = require('../controllers/directory')
const { client } = require('../service/database-connection')
const { validateURL, validateNetwork } = require('../middleware/validate')
const { computeNodeStats } = require('../controllers/stats')

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
      getItems(req.network, req.type)
        .then(data => {
          if (req.type === 'stats') {
            const stats = computeNodeStats(data)
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
