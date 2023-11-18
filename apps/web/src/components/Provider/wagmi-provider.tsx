'use client'

import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, sepolia, goerli, polygonMumbai } from 'viem/chains'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { makeChain } from '@/lib/utils'

const chains = [
    sepolia,
    goerli,
    polygonMumbai,
]

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'ODULGIT_ID'

const metadata = {
    name: 'Odulgit',
    description: 'Odulgit',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({
    wagmiConfig, projectId, chains,
    themeVariables: {
        '--w3m-color-mix': '#3B2172',
        '--w3m-color-mix-strength': 40
    }
})


export const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <WagmiConfig config={wagmiConfig}>
            {children}
        </WagmiConfig>
    )
}