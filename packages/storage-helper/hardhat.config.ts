import { HardhatUserConfig } from "hardhat/config"
import { NetworkUserConfig } from "hardhat/types"
// hardhat plugin
import "hardhat-deploy"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "@nomicfoundation/hardhat-toolbox"

import { config as dotenvConfig } from "dotenv"
import { resolve } from "path"
import { loadTasks } from "./scripts/helpers/hardhatConfigHelpers"

dotenvConfig({ path: resolve(__dirname, "./.env") })

const taskFolder = ["tasks"]
loadTasks(taskFolder)

const chainIds = {
  hardhat: 31337,
  calibration: 314159,
  filecoinMainnet: 314,
}

// Ensure that we have all the environment variables we need.
let pk: string | undefined = process.env.PRIVATE_KEY
if (!pk) {
  pk = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaba"
  // throw new Error("Please set your pk in a .env file")
}

function getChainConfig (chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl: string
  switch (chain) {
    case "calibration":
      jsonRpcUrl = "https://api.calibration.node.glif.io/rpc/v1"
      break
    case "filecoinMainnet":
      jsonRpcUrl = "https://api.node.glif.io"
      break
    default:
      jsonRpcUrl = "https://api.calibration.node.glif.io/rpc/v1"
  }
  return {
    accounts: [`0x${pk}`],
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  }
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: chainIds.hardhat,
    },
    local: {
      url: "http://127.0.0.1:8545",
    },
    calibration: getChainConfig("calibration"),
    filecoinMainnet: getChainConfig("filecoinMainnet"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
        details: { yul: false },
      },
    },
  },
}

export default config
