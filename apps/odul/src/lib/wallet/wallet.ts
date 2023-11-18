import { EthereumProvider } from "@walletconnect/ethereum-provider"
import QRCode from "qrcode-terminal"
import { resolve } from "node:path"
import { config as dotenvConfig } from "dotenv"
import { getConfig } from "../service/config"

dotenvConfig({ path: resolve(__dirname, "../../../.env") })

export const metadata = {
  name: "odul",
  description: "Web3 Git",
  url: "http://test.com",
  icons: ["https://walletconnect.com/walletconnect-logo.png"],
}

// follow EIP-1193 spec
export const createWalletProvider = async () => {
  const provider = await EthereumProvider.init({
    projectId: getConfig()?.walletConnect?.projectId as string, // REQUIRED your projectId
    chains: [11155111], // REQUIRED chain ids
    optionalChains: [11155111], // OPTIONAL chain ids
    showQrModal: false, // REQUIRED set to "true" to use @walletconnect/modal
    metadata, // OPTIONAL metadata of your app
    events: ["accountsChanged", "chainChanged", "network", "disconnect", "display_uri"], // REQUIRED ethereum events
    optionalMethods: [
      "personal_sign",
      "eth_sendTransaction",
      "eth_accounts",
      "eth_requestAccounts",
      "eth_call",
      "eth_getBalance",
      "eth_sendRawTransaction",
      "eth_sign",
      "eth_signTransaction",
      "eth_signTypedData",
      "eth_signTypedData_v3",
      "eth_signTypedData_v4",
      "wallet_switchEthereumChain",
      "wallet_addEthereumChain",
      "wallet_getPermissions",
      "wallet_requestPermissions",
      "wallet_registerOnboarding",
      "wallet_watchAsset",
      "wallet_scanQRCode",
    ],
  })
  await Promise.all([
    new Promise<void>((resolve) => {
      provider.on("display_uri", (uri) => {
        QRCode.generate(uri, { small: true })
        resolve()
      })
    }),
    provider.connect(),
  ])
  await provider.signer.client.core.relayer.transportClose()
  return provider
}

export const walletDisconnect = async (provider: any) => {
  await provider.signer.client.core.relayer.transportClose()
  await provider.signer.client.disconnect({
    topic: provider.session.topic,
    reason: "disconnect",
  })
}
