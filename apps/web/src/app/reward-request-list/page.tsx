'use client'
import { useState, useEffect } from "react";
import CommContainer from '@/components/common-container';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import * as React from "react"
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { RRData, getBountyList, getRewardRequestList, getBounty } from "@/service/Git/contract";
import { Link2, Hash } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function RRList() {
  const router = useRouter();

  const [rewardList, setRewardList] = useState<any[]>([])
  const searchParams = useSearchParams()
  const repoAddress = searchParams.get('address') ?? ''

  useEffect(() => {
    const fetchData = async () => {
      const rewardRequest = await getRewardRequestList(repoAddress)
      const result = await Promise.all(rewardRequest.map(async (request) => {
        const bounty = await getBounty(repoAddress, request.linkBounty)
        return {
          id: request.id,
          address: request.address,
          contributor: request.contributor,
          contributeId: request.contributeId,
          linkBounty: request.linkBounty,
          bountyName: bounty.title,
          commitHash: request.commitHash
        }
      }))
      console.log(result)
      setRewardList(result)
    }
    fetchData()
  }, [])

  return (
    <main className='background min-h-screen'>
      <Container>
        <div className="flex flex-col">
          <div className='mt-24 mx-24'>
            <div className="flex flex-row justify-between">
              <div className='flex-row text-2xl font-roboto-bold'>
                Reward Requests
              </div>
              <Button className='custom-create-issue-btn'
                onClick={() => (router.push(`reward-request-list/create-request?address=${repoAddress}`))}>
                Create New Reward Request
              </Button>
            </div>
            <div className='flex flex-col mt-4 space-y-6'>
              <TooltipProvider>

                {rewardList.map((request, index) => (
                  <CommContainer className='p-6'>
                    <div className="flex items-center">
                      <div className='flex flex-1 flex-row space-x-2'>
                        <img src="./Icon-repo.svg" alt="Repo Icon" />
                        <div className=" text-purple-400 text-xl font-roboto-bold">
                          Request {Number(request.contributeId)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row mt-3">
                      <Tooltip>
                        <TooltipTrigger>
                          <Hash />
                        </TooltipTrigger>
                        <TooltipContent>
                          Last Commit
                        </TooltipContent>
                      </Tooltip>
                      <div className="text-md font-roboto-bold">
                        {request.commitHash}
                      </div>
                    </div>
                    <div className="flex flex-row mt-3 items-center space-x-6">
                      <div className="flex flex-row">
                        <Tooltip>
                          <TooltipTrigger>
                            <Link2 className="" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Link Bounty
                          </TooltipContent>
                        </Tooltip>
                        <div className="flex-1 ml-1">{request.bountyName}</div>
                      </div>
                      <div className="flex flex-row">
                        <Tooltip>
                          <TooltipTrigger>
                            <img src="./Icon-authors.svg" alt="Issues Icon" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Contributor
                          </TooltipContent>
                        </Tooltip>
                        <div className="flex-1 ml-1">{request.contributor}</div>
                      </div>
                    </div>
                  </CommContainer>
                ))}
              </TooltipProvider>

            </div>
          </div>
        </div>
      </Container >
    </main >
  );
}
