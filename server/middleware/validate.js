const httpError = require("http-errors");

const log = require("pino")();

function validateGridVersion(req, res, next) {
  const { query } = req;
  const allowedGridVersions = ["all", "grid2", "grid3"];

  let gridVersion = query.grid === undefined ? "all" : query.grid;
  log.warn(`gridVersion: ${gridVersion}`);
  gridVersion = gridVersion.toLowerCase();

  if (!allowedGridVersions.includes(gridVersion)) {
    next(
      httpError(
        400,
        `query ${gridVersion} not allowed, only ${allowedGridVersions} are valid.`
      )
    );
  }

  req.gridVersion = gridVersion;
  next();
}

function validateNetwork(req, res, next) {
  const { query } = req;
  const allowedNetworks = ["mainnet", "testnet", "devnet", "all"];

  let network = query.network === undefined ? "all" : query.network;
  network = network.toLowerCase();

  if (!allowedNetworks.includes(network)) {
    next(
      httpError(
        400,
        `query ${network} not allowed, only ${allowedNetworks} are valid.`
      )
    );
  }

  req.network = network;
  next();
}

function validateURL(req, res, next) {
  const { path } = req;
  const allowedPaths = ["nodes", "gateways", "farms", "stats", "prices"];
  const splittedPath = path.split("/");

  if (splittedPath.length < 2) {
    next(httpError(400));
  }

  if (!allowedPaths.includes(splittedPath[1])) {
    next(
      httpError(
        400,
        `path ${splittedPath[1]} not allowed, only ${allowedPaths} are valid.`
      )
    );
  }

  req.type = splittedPath[1];
  next();
}

module.exports = {
  validateNetwork,
  validateGridVersion,
  validateURL,
};
