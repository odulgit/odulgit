import lighthouse from "@lighthouse-web3/sdk"
import { ethers, providers } from "ethers"
// for example
import { config as dotenvConfig } from "dotenv"
import { resolve } from "path"

dotenvConfig({ path: resolve(__dirname, "../../.env") })

const sign = async (privateKey: string) => {
  const provider = new providers.JsonRpcProvider("https://eth.llamarpc.com")
  const signer = new ethers.Wallet(privateKey, provider)
  const messageRequested = (await lighthouse.getAuthMessage(await signer.getAddress())).data.message
  const signMessage = await signer.signMessage(messageRequested)
  return signMessage
}

export const uploadData = async (file: any, apiKey: string): Promise<any> => {
  return await lighthouse.upload(file, apiKey)
}

export const installEncryptData = async (cid: string, privKey: string) => {
  const provider = new providers.JsonRpcProvider("https://eth.llamarpc.com")
  const signer = new ethers.Wallet(privKey, provider)
  const pubKey = await signer.getAddress()
  const signMessage = await sign(privKey)
  lighthouse.fetchEncryptionKey(
    cid,
    pubKey,
    signMessage,
  ).then((key) => {
    console.log(key)
  }).catch((e) => {
    console.log(e)
  })
}

export const lighthouseCAR = async (filePath: string, apiKey: string) => {
  const authToken = await lighthouse.dataDepotAuth(apiKey)
  // Create CAR
  const response = await lighthouse.createCar(filePath, authToken.data.access_token)

  console.log(response)
}

const example = async () => {
  const apiKey = process.env.LIGHT_HOUSE_API as string
  const privateKey = process.env.PRIVATE_KEY as string
  const res = await uploadData("./.gitignore", apiKey)
  console.log(res)

  const model = await installEncryptData(res.data.Hash, privateKey)
  console.log(model)
}
