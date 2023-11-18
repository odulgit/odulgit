'use client'

import { getNetwork } from 'wagmi/actions'
import { abi as factoryAbi } from '@/service/GitFactory/abi'
import { getRepo, RepoData } from '@/service/Git/contract';
import { publicClients } from '@/service/client'

export const gitFactoryAddress: any = {
  'Goerli': process.env.NEXT_PUBLIC_GIT_FATCOTRY_GOERLI_CONTRACT
}

export const getRepoCount = async () => {
  const { chain } = getNetwork()
  const publicClient = publicClients[chain!.name]
  const data = await publicClient.readContract({
    address: gitFactoryAddress[chain!.name],
    abi: factoryAbi,
    functionName: 'repoCount',
    args: [],
  })
  return data
}

export const getRepoList = async (): Promise<RepoData[]> => {
  const count = await getRepoCount()
  const reposList: RepoData[] = []
  const { chain } = getNetwork()

  for (let i = 0; i < Number(count); i++) {
    const publicClient = publicClients[chain!.name]
    const repoAddress = await publicClient.readContract({
      address: gitFactoryAddress[chain!.name],
      abi: factoryAbi,
      functionName: 'repos',
      args: [i],
    })

    const repoData: RepoData= await getRepo(repoAddress)

    reposList.push(repoData)
  }

  return reposList
}



