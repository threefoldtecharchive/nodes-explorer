const axios = require("axios");
const config = require("../config");
const { flatten } = require("lodash");

async function getItems(gridVersion, network, type) {
  if (type === "stats") {
    type = "nodes";
  }

  const firstPage = await Promise.all(getItemFromExplorer(type, gridVersion, network, 500, 1));
  const pageSize = Math.max(...firstPage.map(({ headers }) => +headers.pages));
  const pages = Array.from({ length: pageSize }, (_, i) => i + 2);

  const items = await Promise.all([
    Promise.resolve(firstPage),
    ...pages.map(page => {
      return Promise.all(getItemFromExplorer(type, gridVersion, network, 500, page));
    }),
  ])

  return flatten(
    flatten(items).map(({ data, config }) => {
      return data.map((item) => {
        item.url = config.url;
        return item;
      });
    })
  );
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
            ret_count: true
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
  return nodes.map((node) => {
    node.state = getState(node)
    if (!node.url.includes("gridproxy")) return node
    return {
      id: node.id,
      node_id: node.nodeId,
      os_version: node.zosVersion ? node.zosVersion : node.version ? node.version : "None",
      farm_id: node.farmId,
      farm_name: "node.farm_name",
      location: node.location,
      status: { status: node.status },
      state: getState(node),
      total_resources: resourcesToGigaBytes(node.total_resources),
      used_resources: resourcesToGigaBytes(node.used_resources),
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

function resourcesToGigaBytes(resources) {
  resources.mru = Math.ceil(resources.mru / 1024 ** 3)
  resources.sru = Math.ceil(resources.sru / 1024 ** 3)
  resources.hru = Math.ceil(resources.hru / 1024 ** 3)
  return resources
}

function getState(node) {
  const { reserved } = node;
  if (reserved) return { color: 'green', status: 'up' };

  // Grid3 check
  const { status } = node;
  if (status === "up") return { color: 'green', status: 'up' };

  // updated for v2 and updatedAt for v3
  const timestamp = new Date().getTime() / 1000;
  const updated = new Date(node.updatedAt).getTime() / 1000 || node.updated
  const minutes = (timestamp - updated) / 60;
  if (minutes < 15) return { color: 'green', status: 'up' }
  else if (minutes > 16 && minutes < 20) return { color: 'orange', status: 'likely down' }
  else return { color: 'red', status: 'down' }
}

module.exports = {
  getItems,
  getUrls,
  mappingV3Object,
};
