import { fallback, createPublicClient, http } from 'viem'
import { 
  goerli, 
  sepolia, 
  arbitrumSepolia, 
  scrollSepolia,
  polygonZkEvmTestnet,
  gnosisChiado,
} from 'viem/chains'
import { makeChain } from '@/lib/utils'

const goerliProvider = [
  http('https://eth-goerli.api.onfinality.io/public'),
  http('https://goerli.blockpi.network/v1/rpc/public'),
  http('https://ethereum-goerli.publicnode.com'),
  http('https://api.zan.top/node/v1/eth/goerli/public')
]

const sepoliaProvider = [
  http('https://rpc.notadegen.com/eth/sepolia'),
  http('https://rpc-sepolia.rockx.com'),
  http('https://rpc.notadegen.com/eth/sepolia')
]

const arbSepoliaProvider = [
  http('https://sepolia-rollup.arbitrum.io/rpc')
]

const zkEvmTestnetProvider = [
  http('https://rpc.public.zkevm-test.net')
]

const gnosisChiadoProvider = [
  http('https://1rpc.io/gnosis')
]

const scrollSepoliaProvider = [
  http('https://sepolia-rpc.scroll.io'),
]

export const goerliClient: any = createPublicClient({
  chain: goerli,
  transport: fallback(goerliProvider)
})

export const sepoliaClient: any = createPublicClient({
  chain: sepolia,
  transport: fallback(sepoliaProvider)
})

export const arbSepoliaClient: any = createPublicClient({
  chain: arbitrumSepolia,
  transport: fallback(arbSepoliaProvider)
})

export const zkEvmTestnetClient: any = createPublicClient({
  chain: polygonZkEvmTestnet,
  transport: fallback(zkEvmTestnetProvider)
})

export const gnosisChiadoClient: any = createPublicClient({
  chain: gnosisChiado,
  transport: fallback(gnosisChiadoProvider)
})

export const scrollSepoliaClient: any = createPublicClient({
  chain: scrollSepolia,
  transport: fallback(scrollSepoliaProvider)
})

export const publicClients: any = {
  'Goerli': goerliClient,
  'Sepolia':sepoliaClient,
  'Gnosis Chiado': gnosisChiadoClient,
  'Arbitrum Sepolia':arbSepoliaClient,
  'Polygon zkEVM Testnet': zkEvmTestnetClient,
  'Scroll Sepolia': scrollSepoliaClient
}