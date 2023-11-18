"use client";

import { useState, useEffect } from "react";
import CommContainer from "@/components/common-container";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { getRepo, RepoData } from "@/service/Git/contract";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { formatString } from "../../../lib/utils";
import { Input } from "@/components/ui/input";

export default function Page({ params }: { params: { repoAddress: string } }) {
  const [issueAmount, setIssueAmount] = useState(204);
  const [bountyAmount, setBountyAmount] = useState(6800);
  const [repo, setRepo] = useState<RepoData>();
  const [copied, setCopied] = useState(false);
  const [urlCopied, setURLCopied] = useState(false);
  const { toast } = useToast();

  const searchParams = useSearchParams();

  const handleCopyText = (textToCopy?: string) => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      });
    }
    toast({
      title: "Repository Copied!",
      description: `Address: ${textToCopy}`,
    });
  };

  const handleURL = (textToCopy?: string) => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setURLCopied(true);
        setTimeout(() => {
          setURLCopied(false);
        }, 1000);
      });
    }
    toast({
      title: "Repository URL Copied!",
    });
  };

  const handleContinued = () => {
    toast({
      title: "OdulGit",
      description: `See you very soon!`,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const repoAddress = searchParams.get("address") ?? "";
      const repo: RepoData = await getRepo(repoAddress);
      setRepo(repo);
    };
    fetchData();
  }, []);

  return (
    <main className="background min-h-screen">
      <Container>
        <div className="flex flex-col">
          <div className="mt-24 mx-24">
            <div className="flex flex-col space-y-5 mb-5">
              <div className="flex flex-row space-x-3 items-center">
                <div className="text-purple-400 text-2xl font-roboto-bold">
                  Repository {repo?.name} /
                </div>
                <div className="text-2xl font-roboto-bold">
                  {formatString(repo?.address as string, 8)}
                </div>
                <div className="">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (!copied) {
                        handleCopyText(repo?.address);
                      }
                    }}
                  >
                    {copied ? (
                      <img src="../Icon-check.svg" alt="Copy Icon" />
                    ) : (
                      <img src="../Icon-copy.svg" alt="Copy Icon" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-5 pb-6">
              <div className="text-2xl font-roboto-bold">Description</div>
              <CommContainer>
                <div className="flex flex-row px-6 py-3">
                  <div className="flex-1">
                    Description for trending repo 1.See what the GitHub
                    community is most excited about today. Lorem Ipsum has been
                    the industry's standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled
                    it to make a type specimen book. It has survived not only
                    five centuries, but also the leap into electronic
                    typesetting, remaining essentially unchanged. It was
                    popularised in the 1960s with the release of Letraset sheets
                    containing Lorem Ipsum passages, and more recently with
                    desktop publishing software like Aldus PageMaker including
                    versions of Lorem Ipsum.
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        handleContinued();
                      }}
                    >
                      <img src="../Icon-edit.svg" alt="Edit Icon" />
                    </Button>
                  </div>
                </div>
              </CommContainer>
            </div>

            <div>
              <div className="flex flex-col space-y-5">
                <div className="text-2xl font-roboto-bold">Dashboard</div>
                <div className="flex flex-row space-x-5">
                  <CommContainer>
                    <div className="flex flex-col px-6 py-4 h-48">
                      <div className="flex flex-row mb-3 space-x-2">
                        <img src="../Icon-repo.svg" alt="Repo Icon" />
                        <div>Repositories URL</div>
                      </div>
                      <div className="w-full flex flex-row">
                        <Input
                          disabled
                          className="custom-input"
                          value={`https://odulgit.net/odulgit/repo-list/repo?address=${repo?.address}`}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (!urlCopied) {
                              handleURL(
                                `https://odulgit.net/odulgit/repo-list/repo?address=${repo?.address}`
                              );
                            }
                          }}
                        >
                          {urlCopied ? (
                            <img src="../Icon-check.svg" alt="Copy Icon" />
                          ) : (
                            <img src="../Icon-copy.svg" alt="Copy Icon" />
                          )}
                        </Button>
                      </div>
                      <div className="flex h-full items-end justify-end mt-4 pb-4">
                        <Button onClick={() => handleContinued()}>
                          View All
                        </Button>
                      </div>
                    </div>
                  </CommContainer>
                  <CommContainer>
                    <div className="flex flex-col px-6 py-4  h-48">
                      <div className="flex flex-row mb-3 space-x-2">
                        <img src="../Icon-issues.svg" alt="Issue Icon" />
                        <div>Issues Total Amount</div>
                        <div className="flex flex-1 justify-end">
                          {issueAmount}
                        </div>
                      </div>
                      <div className="flex flex-row mb-3 space-x-2">
                        <img src="../Icon-value.svg" alt="Value Icon" />
                        <div>Bounty Total Amount</div>
                        <div className="flex flex-1 justify-end">
                          {bountyAmount}
                        </div>
                      </div>
                      <div className="flex h-full items-end justify-end mt-4 pb-4">
                        <Button onClick={() => handleContinued()}>
                          View All
                        </Button>
                      </div>
                    </div>
                  </CommContainer>
                  <CommContainer>
                    <div className="flex flex-col px-6 py-4 h-48">
                      <div className="flex flex-row mb-3 space-x-2">
                        <img src="../Icon-pull.svg" alt="Pull Icon" />
                        <div>Pull Requests</div>
                      </div>
                      <div className="flex justify-end mt-3">4 Pending</div>
                      <div className="flex h-full items-end justify-end mt-4 pb-4">
                        <Button onClick={() => handleContinued()}>
                          View All
                        </Button>
                      </div>
                    </div>
                  </CommContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
