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


  const mockIssueList = [
    {
      cid: "1",
      hash: "hash1",
      name: "yt-liyt",
      owner: "yt-liyt",
      description:
        "Description for trending repo 1.See what the GitHub community is most excited about today.",
      contract: "repo1",
      status: "OPEN",
      bounty: 80,
      stars: 25178,
      forks: 56,
      issues: 0,
      merged: 0,
      updatedTime: "1699546283019",
    },
    {
      cid: "2",
      hash: "hash2",
      name: "Crafttool",
      owner: "freepik-ai",
      description:
        "Description for trending repo 2.See what the GitHub community is most excited about today.",
      contract: "repo2",
      status: "OPEN",
      bounty: 50,
      stars: 1902,
      forks: 30,
      issues: 0,
      merged: 0,
      updatedTime: "1699546283019",
    },
    {
      cid: "3",
      hash: "hash3",
      name: "jenkins-nix-ci",
      owner: "yt-liyt",
      description:
        "Description for trending repo 3.See what the GitHub community is most excited about today.",
      contract: "repo3",
      status: "OPEN",
      bounty: 20,
      stars: 290,
      forks: 20,
      issues: 0,
      merged: 0,
      updatedTime: "1699546283019",
    },
    {
      cid: "4",
      hash: "hash4",
      name: "presto-ui",
      owner: "yt-liyt",
      description:
        "Description for trending repo 4.See what the GitHub community is most excited about today.",
      contract: "repo4",
      status: "OPEN",
      bounty: 20,
      stars: 102,
      forks: 10,
      issues: 0,
      merged: 0,
      updatedTime: "1699546283019",
    },
    {
      cid: "5",
      hash: "hash5",
      name: "web3modal-cli",
      owner: "yt-liyt",
      description:
        "Description for trending repo 4.See what the GitHub community is most excited about today.",
      contract: "repo4",
      status: "OPEN",
      bounty: 10,
      stars: 82,
      forks: 1,
      issues: 0,
      merged: 0,
      updatedTime: "1699546283019",
    },
  ];

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
                  <div className="flex items-center">
                    <div className="w-full flex flex-row justify-between">
                      <div className="flex flex-row space-x-2">
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
                        <div className="text-xl font-roboto-bold">
                          {/* <Badge variant="default">
                            <img src="./Icon-value.svg" alt="Value Icon" className='mr-1' />
                            {bounty.bounty}
                          </Badge> */}
                        </div>
                        <Button variant="ghost" size="icon">
                          <img src="./Icon-dot-more.svg" alt="More Icon" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row py-3">
                    <div className="flex-1">{bounty.description}</div>
                  </div>
                  <hr className="custom-container-hr my-3" />
                </CommContainer>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
