const axios = require("axios");
const config = require("../config");
const { flatten } = require("lodash");

const log = require("pino")();

async function getItems(gridVersion, network, type) {
  if (type === "stats") {
    type = "nodes";
  }

  const startPage = 1;

  const response = await Promise.all(
    getItemFromExplorer(type, gridVersion, network, 500, startPage)
  );
  const pages = response.map((res) => {
    return parseInt(res.headers.pages, 10);
  });
  const itemsPageOne = flatten(
    response.map((res) => {
      return res.data.map((item) => {
        return {
          ...item,
          url: res.config.url,
        };
      });
    })
  );

  const promises = [];
  pages.forEach((page) => {
    for (let index = startPage + 1; index <= page; index++) {
      promises.push(
        getItemFromExplorer(type, gridVersion, network, 500, index)
      );
    }
  });

  const items = await Promise.all(flatten(promises));
  if (items) {
  const mappedItems = flatten(
    items.map((res) => {
      if (res.data) {
        return res.data.map((item) => {
          return {
            ...item,
            url: res.config.url,
          };
        });
      } else {
        log.warn("No response from explorer");
        return [];
      }
    })
  );
  return [...itemsPageOne, ...mappedItems];
  } else {
    return itemsPageOne;
  }
}

// Type can be nodes / farms / gateways
function getItemFromExplorer(type, gridVersion, network, size, page) {
  return getUrls(gridVersion, network).map((url) => {
    return new Promise((res) => {
      axios
        .get(`${url}/${type}`, {
          params: {
            size,
            page,
          },
        })
        .then(res)
        .catch((err) => {
          console.log("Error", err);
          res(null);
        });
    });
  });
}

function getUrls(gridVersion, network) {
  return config[gridVersion][network];
}

function mappingV3Object(gridVersion, nodes) {
  if (gridVersion === "grid2") return nodes;
  return nodes.map((node) => {
    if (!node.url.includes("gridproxy")) return node;
    return {
      id: node.id,
      node_id: node.nodeId,
      os_version: node.version ? node.version : "None",
      farm_id: node.farmId,
      farm_name: "node.farm_name",
      location: node.location,
      status: { status: node.status },
      total_resources: node.total_resources,
      used_resources: node.used_resources,
      reserved_resources: node.used_resources,
      updated: new Date(node.updatedAt).getTime() / 1000,
      uptime: node.uptime,
      certificationType: node.certificationType,
      workloads: {},
      reserved: node.status === "up",
      managed_domains: node.publicConfig ? [node.publicConfig.domain] : [],
      free_to_use: node.status === "up" && checkFreeToUse(node),
      url: node.url,
    };
  });
}

function checkFreeToUse(node) {
  const { total_resources: tr, used_resources: us } = node;
  return (
    tr.cru - us.cru > 0 &&
    tr.mru - us.mru > 0 &&
    tr.hru - us.hru > 0 &&
    tr.sru - us.sru > 0
  );
}

module.exports = {
  getItems,
  getUrls,
  mappingV3Object,
};
