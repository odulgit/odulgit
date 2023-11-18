'use client'
import Image from 'next/image'
import { useState, useEffect } from "react";
import CommContainer from '@/components/common-container';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Tree } from '@/components/folder-tree';
import { File, Folder } from "lucide-react";
import * as React from "react"
import useResizeObserver from "use-resize-observer";
import { FC } from 'react';
import { getRepo, RepoData } from '@/service/Git/contract'
import { getRepoList } from '@/service/GitFactory/contract'
import { useSearchParams } from 'next/navigation'

export default function Page({ params }: { params: { repoAddress: string } }) {
    const [repoIndex, setRepoIndex] = useState(1)
    const [repoOwner, setRepoOwner] = useState('yt-liyt')
    const [repoName, setRepoName] = useState('yt-liyt')
    const [issueAmount, setIssueAmount] = useState(204)
    const [bountyAmount, setBountyAmount] = useState(6800)
    const [repo, setRepo] = useState<RepoData>()

    const searchParams = useSearchParams()

    useEffect(() => {
        const fetchData = async () => {
            const repoAddress = searchParams.get('address') ?? ''
            const repo: RepoData = await getRepo(repoAddress)
            setRepo(repo)
        }
        fetchData()
    }, [])

    const data = [
        {
            id: "1",
            name: "src",
            children: [
                { id: "a1", name: "index.js" },
                { id: "a2", name: "App.js" },
                { id: "a3", name: "decrypt_connector_auth.js" },
                {
                    id: "a4", name: "components", children: [
                        { id: "a41", name: "Fontstyle.js" },
                        { id: "a42", name: "Button.js" },
                    ]
                },
            ],
        },
    ];
    const [content, setContent] = React.useState("Admin Page")
    const { ref: refRoot, width, height } = useResizeObserver();
    return (
        <main className='background min-h-screen'>
            <Container>
                <div className="flex flex-col">
                    <div className="mt-24 mx-24">
                        <div className="flex flex-col space-y-5 mb-5">
                            <div className="flex flex-row space-x-3 items-center">
                                <div className="text-purple-400 text-2xl font-roboto-bold">
                                    Repository {repo?.owner} /
                                </div>
                                <div className="text-2xl font-roboto-bold">
                                    {repoName}
                                    {repo?.name}
                                </div>
                                <div className="">
                                    Copy
                                </div>
                            </div>
                            <CommContainer>
                                <div className="flex flex-row px-6 py-3">
                                    <div className="flex-1">
                                        Description for trending repo 1.See what the GitHub community is most excited about today.
                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                    </div>
                                    <div>
                                        Edit
                                    </div>
                                </div>
                            </CommContainer>
                        </div>
                        <div>
                            <div className="flex flex-col space-y-5">
                                <div className="text-2xl font-roboto-bold">
                                    Dashboard
                                </div>
                                <div className="flex flex-row space-x-5" >
                                    <CommContainer>
                                        <div className="flex flex-col px-6 py-4">
                                            <div className="flex flex-row mb-3 space-x-2">
                                                <img src="./Icon-repo.svg" alt="Repo Icon" />
                                                <div>
                                                    Repositories Address
                                                </div>
                                            </div>
                                            <div className="w-full flex flex-row">
                                                <div className="flex-1">
                                                    address
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-7">
                                                <Button>
                                                    View All
                                                </Button>
                                            </div>
                                        </div>
                                    </CommContainer>
                                    <CommContainer>
                                        <div className="flex flex-col px-6 py-4">
                                            <div className="flex flex-row mb-3 space-x-2">
                                                <img src="./Icon-issues.svg" alt="Issue Icon" />
                                                <div>
                                                    Issues Total Amount
                                                </div>
                                                <div className="flex flex-1 justify-end">
                                                    {issueAmount}
                                                </div>
                                            </div>
                                            <div className="flex flex-row mb-3 space-x-2">
                                                <img src="./Icon-value.svg" alt="Value Icon" />
                                                <div>
                                                    Bounty Total Amount
                                                </div>
                                                <div className="flex flex-1 justify-end">
                                                    {bountyAmount}
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <Button>
                                                    View All
                                                </Button>
                                            </div>
                                        </div>
                                    </CommContainer>
                                    <CommContainer>
                                        <div className="flex flex-col px-6 py-4">
                                            <div className="flex flex-row mb-3 space-x-2">
                                                <img src="./Icon-pull.svg" alt="Pull Icon" />
                                                <div>
                                                    Pull Requests
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-3">
                                                4 Pending
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <Button>
                                                    View All
                                                </Button>
                                            </div>
                                        </div>
                                    </CommContainer>
                                </div>
                                <CommContainer style={{ height: height ? height + 34 : '200px' }}>
                                    <Tree
                                        ref={refRoot}
                                        data={data}
                                        className="flex-shrink-0 h-full"
                                        initialSlelectedItemId="1"
                                        onSelectChange={(item) => setContent(item?.name ?? "")}
                                        folderIcon={Folder}
                                        itemIcon={File}
                                    />
                                </CommContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </Container >
        </main >
    );
}