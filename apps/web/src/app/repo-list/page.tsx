'use client'
import { useState, useEffect } from "react";
import CommContainer from '@/components/common-container';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";

import { getRepoList } from '@/service/GitFactory/contract'
import { RepoData } from "@/service/Git/contract";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"


export default function RepoList() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [repos, setRepos] = useState()
  const { toast } = useToast()

  const handleCopyText = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000)
    });
    toast({
      description: "Copied to clipboard",
    })
  };

  const handleRepoClick = (repoAddress: string) => {
    router.push(`/repo-list/repo?address=${repoAddress}`);
  };

  const defaultRepoData: RepoData[] = []
  const [repoList, setRepoList] = useState(defaultRepoData)

  useEffect(() => {
    const fetchData = async () => {
      const repoList = await getRepoList()
      setRepoList(repoList)
    }
    fetchData()
  }, [])

  return (
    <main className='background min-h-screen'>
      <Container>
        <div className="flex flex-col">
          <div className='mt-24 mx-24'>
            <div className='flex-1 text-2xl mb-6 font-roboto-bold'>
              Repositories
            </div>
            <div className='flex flex-col mt-4 space-y-6'>
              {repoList.map((repo, index) => (
                <CommContainer className='p-6'>
                  <div className="flex items-center">
                    <div className='flex flex-row space-x-2'>
                      <img src="./Icon-repo.svg" alt="Repo Icon" />
                      <div className=" text-purple-400 text-xl font-roboto-bold">
                        Repository - {repo.owner}  /
                      </div>
                      <div className="text-xl font-roboto-bold">
                        {repo.name}
                      </div>
                      {copied
                        ? <Check />
                        : <img src="./Icon-copy.svg" alt="Copy Icon" onClick={() => (handleCopyText(repo.address))} />
                      }
                    </div>
                    <div className='flex flex-1 flex-row items-center justify-end'>
                      <div className="text-xl font-roboto-bold">
                        <Badge variant="default">
                          <img src="./Icon-value.svg" alt="Value Icon" className='mr-1' />
                          {repo.totalBounty}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon">
                        <img src="./Icon-dot-more.svg" alt="More Icon" onClick={() => (
                          handleRepoClick(repo.address)
                        )} />
                      </Button>
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
                      <img src="./Icon-issues.svg" alt="Issues Icon" />
                      <div className="flex-1 ml-1">
                        {repo.bountyCount}
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
