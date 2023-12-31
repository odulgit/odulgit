"use client";
import { useState, useEffect } from "react";
import CommContainer from "@/components/common-container";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

import { getRepoList } from "@/service/GitFactory/contract";
import { RepoData } from "@/service/Git/contract";
import { useToast } from "@/components/ui/use-toast";
import { formatString } from "../../lib/utils";
import { formatEther } from 'viem'
import { useNetwork } from "wagmi";

export default function RepoList() {
  const router = useRouter();
  const { chain } = useNetwork();
  const [copied, setCopied] = useState({
    index: -1,
    copy: false,
  });
  const { toast } = useToast();
  console.log(chain?.name, 'chain?.name')
  const handleCopyText = (number: number, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied({
        index: number,
        copy: true,
      });
      setTimeout(() => {
        setCopied({
          index: -1,
          copy: false,
        });
      }, 1000);
    });
    toast({
      title: "Repository Copied!",
      description: `Address: ${textToCopy}`,
    });
  };

  const handleRepoClick = (repoAddress: string) => {
    router.push(`/repo-list/repo?address=${repoAddress}`);
  };

  const defaultRepoData: RepoData[] = [];
  const [repoList, setRepoList] = useState(defaultRepoData);

  useEffect(() => {
    const fetchData = async () => {
      const repoList = await getRepoList();
      setRepoList(repoList);
    };
    fetchData();
  }, []);

  return (
    <main className="background min-h-screen">
      <Container>
        <div className="flex flex-col">
          <div className="mt-24 mx-24">
            <div className="flex-1 text-2xl mb-6 font-roboto-bold">
              Repositories
            </div>
            <div className="flex flex-col mt-4 space-y-6">
              {repoList.map((repo, index) => (
                <CommContainer className="p-6">
                  <div className="flex items-center">
                    <div className="flex flex-row space-x-2 items-center">
                      <img src="./Icon-repo.svg" alt="Repo Icon" />
                      <div className=" text-purple-400 text-xl font-roboto-bold">
                        Repository - {repo.name} /
                      </div>
                      <div className="text-xl font-roboto-bold">
                        {formatString(repo.address, 8)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        key={index}
                        onClick={() => {
                          if (!copied.copy && index !== copied.index) {
                            handleCopyText(index, repo.address);
                          }
                        }}
                      >
                        {copied.copy && index == copied.index ? (
                          <img src="./Icon-check.svg" alt="Copy Icon" />
                        ) : (
                          <img src="./Icon-copy.svg" alt="Copy Icon" />
                        )}
                      </Button>
                    </div>
                    <div className="flex flex-1 flex-row items-center justify-end">
                      <div className="flex text-xl font-roboto-bold items-center">
                        <Badge variant="default">
                          Ξ {formatEther(repo.totalBounty)}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <img
                            src="./Icon-external-link.svg"
                            alt="More Icon"
                            onClick={() => handleRepoClick(repo.address)}
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row py-3">
                    <div className="flex-1">{repo.description}</div>
                  </div>
                  <Separator />
                  <div className="flex flex-row mt-3 items-center space-x-6">
                    <div className="flex flex-row">
                      <img src="./Icon-issues.svg" alt="Issues Icon" />
                      <div className="flex-1 ml-1">{repo.bountyCount}</div>
                    </div>
                    <div className="flex flex-row">
                      <img src="./Icon-authors.svg" alt="Issues Icon" />
                      <div className="flex-1 ml-1">{repo.owner}</div>
                    </div>
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
