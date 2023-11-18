"use client";
import { useState, useEffect } from "react";
import CommContainer from "@/components/common-container";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { BountyData, getBountyList } from '@/service/Git/contract'

export default function BountyList() {
  const router = useRouter();
  const [bountyList, setBountyList] = useState<BountyData[]>([])

  const searchParams = useSearchParams()
  const repoAddress = searchParams.get('address') ?? ''

  useEffect(() => {
    const fetchData = async () => {
      const bounties: BountyData[] = await getBountyList(repoAddress)
      setBountyList(bounties)
    }
    fetchData()
  }, [])
  return (
    <main className="background min-h-screen">
      <Container>
        <div className="flex flex-col">
          <div className="mt-24 mx-24">
            <div className="flex flex-row justify-between">
              <div className="flex-row text-2xl font-roboto-bold">Bounties</div>
              <Button
                className="custom-create-issue-btn"
                onClick={() => router.push(`bounty-list/create-bounty?address=${repoAddress}`)}
              >
                Create New Bounty
              </Button>
            </div>

            <div className="flex flex-col mt-4 space-y-6">
              {bountyList.map((bounty, index) => (
                <CommContainer className="p-6 custom-container">
                  <div className="w-full flex flex-row justify-between">
                    <div className="flex flex-row space-x-2 items-center">
                      <img src="./Icon-repo.svg" alt="Repo Icon" />
                      <div className=" text-purple-400 text-xl font-roboto-bold">
                        Bounty {bounty.id} /
                      </div>
                      <div className="text-xl font-roboto-bold">
                        {bounty.title}
                      </div>

                      <Button variant="ghost" size="icon">
                        <img src="./Icon-copy.svg" alt="Copy Icon" />
                      </Button>
                    </div>

                    <div className='flex flex-1 flex-row items-center justify-end'>
                      <div className="flex items-center text-xl font-roboto-bold">
                        <Badge variant="default">
                          <img src="./Icon-value.svg" alt="Value Icon" className='mr-1' />
                          {bounty.bountyAmount}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row py-3">
                    <div className="flex-1">{bounty.description}</div>
                  </div>
                </CommContainer>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
