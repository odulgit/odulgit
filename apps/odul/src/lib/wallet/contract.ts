import { providers, BytesLike, Wallet, Contract } from "ethers"
import { createWalletProvider, walletDisconnect } from "./wallet"
import { config as dotenvConfig } from "dotenv"
import { resolve } from "node:path"
import fs from "node:fs"
import { getConfig } from "../service/config"

dotenvConfig({ path: resolve(__dirname, "../../../.env") })

const pk: string | undefined = getConfig().ethereum?.privateKey
if (!pk) {
  throw new Error("Please set your pk in a .env file")
}

const gitFactoryContractABi = JSON.parse(fs.readFileSync(resolve(__dirname, "./GitFactory.json"), "utf-8"))
const gitContractABi = JSON.parse(fs.readFileSync(resolve(__dirname, "./Git.json"), "utf-8"))
export const getWeb3Wallet = async () => {
  const provider = await createWalletProvider()
  const wallet = new providers.Web3Provider(provider)
  return { wallet: wallet.getSigner(), provider: provider }
}
export const getWallet = () => {
  const provider = new providers.JsonRpcProvider(getConfig().ethereum?.networkUrl as string)
  return {
    wallet: new Wallet(pk as BytesLike, provider),
    provider: provider,
  }
}

export const testWalletConnect = async () => {
  const { wallet, provider } = await getWeb3Wallet()
  const address = await wallet.getAddress()
  await walletDisconnect(provider)
  return address
}

export const getGitFactoryContract = () => {
  const { wallet } = getWallet()
  const contract = new Contract(
    getConfig().ethereum?.contract!,
    gitFactoryContractABi.abi,
    wallet,
  )
  return contract
}

export const getGitContract = (address: string) => {
  const { wallet } = getWallet()
  const contract = new Contract(
    address,
    gitContractABi.abi,
    wallet,
  )
  return contract
}
