const express = require("express");
const httpError = require("http-errors");
const router = express.Router();
const { client } = require("../service/database-connection");
const {
  validateURL,
  validateGridVersion,
  validateNetwork,
} = require("../middleware/validate");
const { getItems } = require("../controllers/directory");
const { computeNodeStats } = require("../controllers/stats");
const { getPrices } = require("../controllers/prices");

const log = require("pino")();

router.get("/health", (req, res, next) => {
  res.status(200).send("up");
});

router.get(
  "/*",
  validateURL,
  validateGridVersion,
  validateNetwork,
  (req, res, next) => {
    log.warn(`gridVersion: ${req.url}`);
    client.get(req.url, (err, result) => {
      log.warn(`result: ${result}`);
      if (err) {
        // log.warn(err);
        throw httpError(500, err);
      }
      if (result) {
        return res.status(200).json(JSON.parse(result));
      } else {
        if (req.type === "prices") {
          return getPrices(req.type, req.network).then((response) => {
            client.setex(req.url, 600, JSON.stringify(response.data));
            res.send(response.data);
          });
        }
        log.warn(`req.grid: ${req.gridVersion}`);
        getItems(req.gridVersion, req.network, req.type)
          .then((data) => {
            if (req.type === "stats") {
              const stats = computeNodeStats(data);
              client.setex(req.url, 600, JSON.stringify(stats));
              res.send(stats);
            } else {
              client.setex(req.url, 600, JSON.stringify(data));
              res.send(data);
            }
          })
          .catch(next);
      }
    });
  }
);

module.exports = router;
