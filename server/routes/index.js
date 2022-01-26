const express = require("express");
const httpError = require("http-errors");
const router = express.Router();
const { client } = require("../service/database-connection");
const {
  validateURL,
  validateGridVersion,
  validateNetwork,
} = require("../middleware/validate");
const { getItems, mappingV3Object } = require("../controllers/directory");
const { computeNodeStats } = require("../controllers/stats");
const { getPrices } = require("../controllers/prices");

router.get("/health", (req, res, next) => {
  res.status(200).send("up");
});

router.get(
  "/*",
  validateURL,
  validateGridVersion,
  validateNetwork,
  (req, res, next) => {
    client.get(req.url, (err, result) => {
      if (err) {
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
        getItems(req.gridVersion, req.network, req.type)
          .then((data) => {
            let returnData = data;
            if (req.type === "stats") {
              const stats = computeNodeStats(data);
              returnData = stats;
            }
            // mapping V3 object to V2 object
            if (["nodes", "gateways"].includes(req.type)) {
              returnData = mappingV3Object(req.gridVersion, data);
            }
            client.setex(req.url, 600, JSON.stringify(returnData));
            res.send(returnData);
          })
          .catch(next);
      }
    });
  }
);

module.exports = router;
