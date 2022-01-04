const axios = require("axios");
const config = require("../config");
const { flatten } = require("lodash");

const log = require("pino")();

async function getItems(gridVeriosn, network, type) {
  if (type === "stats") {
    type = "nodes";
  }

  const startPage = 1;

  const response = await Promise.all(
    getItemFromExplorer(type, gridVeriosn, network, 500, startPage)
  );
  const pages = response.map((res) => {
    const log = require("pino")();
    log.warn(`res: ${res}`);
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
        getItemFromExplorer(type, gridVeriosn, network, 500, index)
      );
    }
  });

  const items = await Promise.all(flatten(promises));
  const mappedItems = flatten(
    items.map((res) => {
      return res.data.map((item) => {
        return {
          ...item,
          url: res.config.url,
        };
      });
    })
  );

  return [...mappedItems, ...itemsPageOne];
}

// Type can be nodes / farms / gateways
function getItemFromExplorer(type, gridVeriosn, network, size, page) {
  return getUrls(gridVeriosn, network).map((url) => {
    let urlToUse = url;
    if (gridVeriosn === "grid3") {
      urlToUse = `${url}/${type}`;
    } else {
      urlToUse = `${url}/explorer/${type}`;
    }
    log.warn(`type: ${type}`);
    log.warn(`urlToUse: ${urlToUse}`);
    return new Promise((res) => {
      axios
        .get(urlToUse, {
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

function getUrls(gridVeriosn, network) {
  return config[gridVeriosn][network];
}

module.exports = {
  getItems,
  getUrls,
};
