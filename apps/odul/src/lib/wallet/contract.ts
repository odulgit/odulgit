import { providers, Contract } from "ethers"
import { createWalletProvider, walletDisconnect } from "./wallet"
import { resolve } from "node:path"
import fs from "node:fs"
import { getConfig } from "../service/config"

const contractAddr: string | undefined = getConfig().ethereum?.contract
if (!contractAddr) {
  throw new Error("Please set your git factory in config file")
}

const gitFactoryContractABi = JSON.parse(fs.readFileSync(resolve(__dirname, "./GitFactory.json"), "utf-8"))
const gitContractABi = JSON.parse(fs.readFileSync(resolve(__dirname, "./Git.json"), "utf-8"))

export const getWeb3Wallet = async () => {
  const provider = await createWalletProvider()
  const wallet = new providers.Web3Provider(provider)
  return { wallet: wallet.getSigner(), provider: provider }
}

export const onlyGetProvider = () => {
  const wallet = new providers.JsonRpcProvider(getConfig().ethereum?.networkUrl as string)
  return { wallet }
}

export const testWalletConnect = async () => {
  const { wallet, provider } = await getWeb3Wallet()
  const address = await wallet.getAddress()
  await walletDisconnect(provider)
  return address
}

export const getGitFactoryContract = async () => {
  // const { wallet } = getWallet()
  const { wallet } = await getWeb3Wallet()
  const contract = new Contract(
    contractAddr,
    gitFactoryContractABi.abi,
    wallet,
  )
  return contract
}

export const getGitContract = async (address: string, get?: boolean) => {
  // const { wallet } = getWallet()
  const { wallet } = (get) ? onlyGetProvider() : await getWeb3Wallet()
  const contract = new Contract(
    address,
    gitContractABi.abi,
    wallet,
  )
  return contract
}
