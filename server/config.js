GRID2_DEVNET_EXPLORER_URL = "https://explorer.devnet.grid.tf/explorer";
GRID2_TESTNET_EXPLORER_URL = "https://explorer.testnet.grid.tf/explorer";
GRID2_MAINNET_EXPLORER_URL = "https://explorer.grid.tf/explorer";

GRID3_DEVNET_EXPLORER_URL = "https://gridproxy.ayoub.gridtesting.xyz";
GRID3_TESTNET_EXPLORER_URL = "https://gridproxy.ayoub.gridtesting.xyz";
GRID3_MAINNET_EXPLORER_URL = "https://gridproxy.ayoub.gridtesting.xyz";

// Update with your config settings.
module.exports = {
  all: {
    mainnet: [GRID2_MAINNET_EXPLORER_URL, GRID3_MAINNET_EXPLORER_URL],
    testnet: [GRID2_TESTNET_EXPLORER_URL, GRID3_TESTNET_EXPLORER_URL],
    devnet: [GRID2_DEVNET_EXPLORER_URL, GRID3_DEVNET_EXPLORER_URL],
    all: [
      GRID2_MAINNET_EXPLORER_URL,
      GRID3_MAINNET_EXPLORER_URL,
      GRID2_TESTNET_EXPLORER_URL,
      GRID3_TESTNET_EXPLORER_URL,
      GRID2_DEVNET_EXPLORER_URL,
      GRID3_DEVNET_EXPLORER_URL,
    ],
    local: ["http://localhost:8080"],
  },
  grid2: {
    mainnet: [GRID2_MAINNET_EXPLORER_URL],
    testnet: [GRID2_TESTNET_EXPLORER_URL],
    devnet: [GRID2_DEVNET_EXPLORER_URL],
    all: [
      GRID2_MAINNET_EXPLORER_URL,
      GRID2_TESTNET_EXPLORER_URL,
      GRID2_DEVNET_EXPLORER_URL,
    ],
    local: ["http://localhost:8080"],
  },
  grid3: {
    mainnet: [GRID3_MAINNET_EXPLORER_URL],
    testnet: [GRID3_TESTNET_EXPLORER_URL],
    devnet: [GRID3_DEVNET_EXPLORER_URL],
    all: [
      GRID3_MAINNET_EXPLORER_URL,
      GRID3_TESTNET_EXPLORER_URL,
      GRID3_DEVNET_EXPLORER_URL,
    ],
    local: ["http://localhost:8080"],
  },
};
