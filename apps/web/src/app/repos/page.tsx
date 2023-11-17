'use client'
import { useState } from "react";
import CommContainer from '@/components/common-container';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Tree } from '@/components/folder-tree';
import { Workflow, Folder } from "lucide-react";
import * as React from "react"

export default function Repo() {
  const [repoOwner, setRepoOwner] = useState('testOwner')
  const [repoName, setRepoName] = useState('testName')
  const data = [
    { id: "1", name: "Unread" },
    { id: "2", name: "Threads" },
    {
      id: "3",
      name: "Chat Rooms",
      children: [
        { id: "c1", name: "General" },
        { id: "c2", name: "Random" },
        { id: "c3", name: "Open Source Projects" },
      ],
    },
    {
      id: "4",
      name: "Direct Messages",
      children: [
        {
          id: "d1",
          name: "Alice",
          children: [
            { id: "d11", name: "Alice2" },
            { id: "d12", name: "Bob2" },
            { id: "d13", name: "Charlie2" },
          ],
        },
        { id: "d2", name: "Bob" },
        { id: "d3", name: "Charlie" },
      ],
    },
    {
      id: "5",
      name: "Direct Messages",
      children: [
        {
          id: "e1",
          name: "Alice",
          children: [
            { id: "e11", name: "Alice2" },
            { id: "e12", name: "Bob2" },
            { id: "e13", name: "Charlie2" },
          ],
        },
        { id: "e2", name: "Bob" },
        { id: "e3", name: "Charlie" },
      ],
    },
    {
      id: "6",
      name: "Direct Messages",
      children: [
        {
          id: "f1",
          name: "Alice",
          children: [
            { id: "f11", name: "Alice2" },
            { id: "f12", name: "Bob2" },
            { id: "f13", name: "Charlie2" },
          ],
        },
        { id: "f2", name: "Bob" },
        { id: "f3", name: "Charlie" },
      ],
    },
  ];
  const [content, setContent] = React.useState("Admin Page")

  return (
    <main className='background pt-16'
      style={{
        minHeight: `100vh`
      }}>
      <Container>
        <div className="flex flex-col mt-6 space-y-6 mx-48">
          <div className="flex flex-col">
            <div className="flex flex-row space-x-8 mb-3">
              <div className="">
                Repository 1 - yt-liyt / yt-liyt
              </div>
              <div className="">
                Copy
              </div>
            </div>
            <CommContainer>
              <div className="flex flex-row px-6 py-4">
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
            <div className="flex flex-col space-y-3">
              <div className="">
                Dashboard
              </div>
              <div className="flex flex-row space-x-5" >
                <CommContainer>
                  <div className="flex flex-col px-6 py-4">
                    <div className="flex flex-row mb-3 space-x-2">
                      <div>Icon</div>
                      <div>
                        Repositories Address
                      </div>
                    </div>
                    <div className="w-full flex flex-row">
                      <div className="flex-1">
                        address
                      </div>
                      <div>
                        copy Icon
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
                      <div>Icon</div>
                      <div>
                        Issues Total Amount
                      </div>
                      <div className="flex flex-1 justify-end">
                        Number
                      </div>
                    </div>
                    <div className="flex flex-row mb-3 space-x-2">
                      <div>Icon</div>
                      <div>
                        Issues Total Amount
                      </div>
                      <div className="flex flex-1 justify-end">
                        Number
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
                      <div>Icon</div>
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
              <CommContainer className="max-h-screen">
                <Tree
                  data={data}
                  className="flex-shrink-0"
                  initialSlelectedItemId="f12"
                  onSelectChange={(item) => setContent(item?.name ?? "")}
                  folderIcon={Folder}
                  itemIcon={Workflow}
                />

              </CommContainer>
            </div>
          </div>
        </div>

      </Container>
    </main>
  );
}
