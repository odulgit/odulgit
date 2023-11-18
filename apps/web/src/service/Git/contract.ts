'use client'

import { getNetwork } from 'wagmi/actions'
import { abi as gitAbi} from '@/service/Git/abi'
import { publicClients } from '@/service/client'

export interface RepoData {
    address: string;
    owner: any;
    latestCommit: any;
    name: any;
    defaultBranch: any;
    totalBounty: any;
    bountyCount: any;
    description:string;
  }

export interface BountyData {
    id: number;
    address: string;
    title: any;
    description: any;
    openStatus:string;
    bountyAmount: any;
}

export interface RRData {
    id: number;
    address: string;
    contributor: any;
    contributeId: any;
    linkBounty:any;
    commitHash:any;
}

export const getRepo = async (repoAddress: string) => {
  const { chain } = getNetwork()
  const publicClient = publicClients[chain!.name]
  const repo: RepoData = await publicClient.readContract({
    address: repoAddress,
    abi: gitAbi,
    functionName: 'repo',
    args: [],
  })

  const bountyTotalAmount = await publicClient.readContract({
    address: repoAddress,
    abi: gitAbi,
    functionName: 'bountyTotalAmount',
    args: [],
  })

  const bountyCount = await publicClient.readContract({
    address: repoAddress,
    abi: gitAbi,
    functionName: 'bountyCount',
    args: [],
  })

  const repoData = {
    address: repoAddress,
    owner : repo[0],
    latestCommit: repo[1],
    name: repo[2],
    description: repo[3],
    defaultBranch: repo[4],
    totalBounty: Number(bountyTotalAmount),
    bountyCount: Number(bountyCount),
  }

  return repoData
}

export const getBountyList = async (repoAddress:string) => {
  const { chain } = getNetwork()
  const bountyList: BountyData[] = []

  const publicClient = publicClients[chain!.name]
  const bountyCount = await publicClient.readContract({
    address: repoAddress,
    abi: gitAbi,
    functionName: 'bountyCount',
    args: [],
  })

  for (let i = 0; i < Number(bountyCount); i++) {
    const bountyInfo = await publicClient.readContract({
      address: repoAddress,
      abi: gitAbi,
      functionName: 'getBounty',
      args: [i],
    })

    const bounty:BountyData = {
      id: i,
      address: repoAddress,
      title: bountyInfo[0].title,
      description: bountyInfo[0].description,
      openStatus: bountyInfo[0].openStatus,
      bountyAmount: Number(bountyInfo[1]),
    }
    bountyList.push(bounty)
  }
    return bountyList
}

export const getRewardRequestList = async (repoAddress:string) => {
    const { chain } = getNetwork()
    const requestList: RRData[] = []
  
    const publicClient = publicClients[chain!.name]
    const requestCount = await publicClient.readContract({
      address: repoAddress,
      abi: gitAbi,
      functionName: 'requestCount',
      args: [],
    })
  
    for (let i = 0; i < Number(requestCount); i++) {
      const requestContent = await publicClient.readContract({
        address: repoAddress,
        abi: gitAbi,
        functionName: 'requests',
        args: [i],
      })

      const rr : RRData = {
        id:i,
        address:repoAddress,
        contributor:requestContent[0],
        contributeId:requestContent[1],
        linkBounty:requestContent[2],
        commitHash:requestContent[3]
      }

      requestList.push(rr)
    }
      return requestList
  }

