'use client'
import Image from 'next/image'
import { useState } from "react";
import CommContainer from '@/components/common-container';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Tree } from '@/components/folder-tree';
import { File, Folder } from "lucide-react";
import * as React from "react"
import useResizeObserver from "use-resize-observer";
import { Separator } from "@/components/ui/separator"


export default function RepoList() {

  const mockRepoList = [
    {
      name: "yt-liyt",
      owner: "yt-liyt",
      description: "Description for trending repo 1.See what the GitHub community is most excited about today.",
      contract: "repo1",
      bounty: 80,
      stars: 25178,
      forks: 56,
      issues: 0,
      merged: 0,
      updatedTime: "1699546283019"
    },
    {
      name: "Crafttool",
      owner: "freepik-ai",
      description: "Description for trending repo 2.See what the GitHub community is most excited about today.",
      contract: "repo2",
      bounty: 50,
      stars: 1902,
      forks: 30,
      issues: 0,
      merged: 0,
      updatedTime: "1699546283019"
    },
    {
      name: "jenkins-nix-ci",
      owner: "yt-liyt",
      description: "Description for trending repo 3.See what the GitHub community is most excited about today.",
      contract: "repo3",
      bounty: 20,
      stars: 290,
      forks: 20,
      issues: 0,
      merged: 0,
      updatedTime: "1699546283019"
    },
    {
      name: "presto-ui",
      owner: "yt-liyt",
      description: "Description for trending repo 4.See what the GitHub community is most excited about today.",
      contract: "repo4",
      bounty: 20,
      stars: 102,
      forks: 10,
      issues: 0,
      merged: 0,
      updatedTime: "1699546283019"
    },
    {
      name: "web3modal-cli",
      owner: "yt-liyt",
      description: "Description for trending repo 4.See what the GitHub community is most excited about today.",
      contract: "repo4",
      bounty: 10,
      stars: 82,
      forks: 1,
      issues: 0,
      merged: 0,
      updatedTime: "1699546283019"
    },
  ]

  const [repoList, setRepoList] = useState(mockRepoList)

  return (
    <main className='background min-h-screen'>
      <Container>
        <div className="flex flex-col">
          <div className='mt-24 mx-24'>
            <div className='flex-1 text-2xl mb-6 font-roboto-bold'>
              Repositories
            </div>
            <div className='flex flex-row items-center justify-end'>
              <Button className='w-fit text-xl'>
                Create New Repository
              </Button>
            </div>
            <div className='flex flex-col mt-4 space-y-6'>
              {repoList.map((repo, index) => (
                <CommContainer className='p-6'>
                  <div className="flex items-center">
                    <div className='flex flex-1 flex-row space-x-2'>
                      <img src="./Icon-repo.svg" alt="Repo Icon" />
                      <div className=" text-purple-400 text-xl font-roboto-bold">
                        Repository {index + 1} - {repo.owner}  /
                      </div>
                      <div className="text-xl font-roboto-bold">
                        {repo.name}
                      </div>
                      <img src="./Icon-copy.svg" alt="Copy Icon" />
                    </div>
                    <div className='flex flex-1 flex-row items-center justify-end'>
                      <div className="text-xl font-roboto-bold">
                        {repo.bounty}
                      </div>
                      <img src="./Icon-dot-more.svg" alt="More Icon" />
                    </div>
                  </div>
                  <div className="flex flex-row py-3">
                    <div className="flex-1">
                      {repo.description}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-row mt-3 items-center space-x-6">
                    <div className='flex flex-row'>
                      <img src="./Icon-fav.svg" alt="Star Icon" />
                      <div className="flex-1 ml-1">
                        {repo.stars.toString()}
                      </div>
                    </div>
                    <div className='flex flex-row'>
                      <img src="./Icon-forks.svg" alt="Forks Icon" />
                      <div className="flex-1 ml-1">
                        {repo.forks.toString()}
                      </div>
                    </div>
                    <div className='flex flex-row'>
                      <img src="./Icon-dot-more.svg" alt="More Icon" />
                      <div className="flex-1 ml-1">
                        {repo.issues.toString()}
                      </div>
                    </div>
                    <div className='flex flex-row'>
                      <img src="./Icon-dot-more.svg" alt="More Icon" />
                      <div className="flex-1 ml-1">
                        {repo.merged.toString()}
                      </div>
                    </div>
                    <div className='flex flex-row'>
                      <div className="flex-1 ml-1">
                        {repo.updatedTime}
                      </div>
                    </div>
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
