'use client'
import { useState, useEffect } from "react";
import CommContainer from '@/components/common-container';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import * as React from "react"
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { RRData, getRewardRequestList } from "@/service/Git/contract";
import { useMessages, useSubscription, useW3iAccount } from "@web3inbox/widget-react";

export default function RRList() {
  const router = useRouter();

  const { account } = useW3iAccount();
  const { messages } = useMessages(account);
  const { subscription } = useSubscription(account);
  const [rewardList, setRewardList] = useState<RRData[]>([])
  const searchParams = useSearchParams()
  const repoAddress = searchParams.get('address') ?? ''

  useEffect(() => {
    const fetchData = async () => {
      const rewardRequest = await getRewardRequestList(repoAddress)
      setRewardList(rewardRequest)
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
              {rewardList.map((request, index) => (
                <CommContainer className='p-6'>
                  <div className="flex items-center">
                    <div className='flex flex-1 flex-row space-x-2'>
                      <img src="./Icon-repo.svg" alt="Repo Icon" />
                      <div className=" text-purple-400 text-xl font-roboto-bold">
                        Request {Number(request.contributeId)} - {request.contributor}  /
                      </div>
                      <div className="text-xl font-roboto-bold">
                        {request.commitHash}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row py-3">
                    <div className="flex-1">
                      Link Bounty: {Number(request.linkBounty)}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {messages.map(({ id, message }) => (
                      <div className="flex flex-row space-x-2">
                        <div className="text-purple-400 text-xl font-roboto-bold">
                          {message.title} - {message.body}
                        </div>
                      </div>
                    ))}
                  </div>
                </CommContainer>
              ))}
            </div>
          </div>
        </div>
      </Container >
    </main >
  );
}
