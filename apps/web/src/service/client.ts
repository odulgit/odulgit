import { fallback, createPublicClient, http } from 'viem'
import { goerli, sepolia } from 'viem/chains'
import { makeChain } from '@/lib/utils'

const goerliProvider = [
  http('https://eth-goerli.api.onfinality.io/public'),
  http('https://goerli.blockpi.network/v1/rpc/public'),
  http('https://ethereum-goerli.publicnode.com'),
  http('https://api.zan.top/node/v1/eth/goerli/public')
]

const sepoliaProvider = [
  http('https://api.zan.top/node/v1/eth/sepolia/public'),
  http('https://rpc.notadegen.com/eth/sepolia'),
  http('https://rpc-sepolia.rockx.com'),
  http('https://rpc.notadegen.com/eth/sepolia')
]

export const goerliClient: any = createPublicClient({
  chain: goerli,
  transport: fallback(goerliProvider)
})

export const sepoliaClient: any = createPublicClient({
  chain: sepolia,
  transport: fallback(sepoliaProvider)
})

export const publicClients: any = {
  'Goerli': goerliClient,
  'Sepolia':sepoliaClient
}