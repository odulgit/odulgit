'use client'
import { useState } from "react";
import CommContainer from '@/components/common-container';
import Container from '@/components/ui/container';

export default function Repo() {
  const [repoOwner, setRepoOwner] = useState('testOwner')
  const [repoName, setRepoName] = useState('testName')

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
                  Content
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
                  <div className="flex px-6 py-4">
                    <div className="flex-1">
                      Content
                    </div>
                    <div>
                      Edit
                    </div>
                  </div>
                </CommContainer>
                <CommContainer>
                  <div className="flex px-6 py-4">
                    <div className="flex-1">
                      Content
                    </div>
                    <div>
                      Edit
                    </div>
                  </div>
                </CommContainer>
                <CommContainer>
                  <div className="flex px-6 py-4">
                    <div className="flex-1">
                      Content
                    </div>
                    <div>
                      Edit
                    </div>
                  </div>
                </CommContainer>
              </div>
              <CommContainer>
                <div className="flex px-6 py-4">
                  <div className="flex-1">
                    Content
                  </div>
                  <div>
                    Edit
                  </div>
                </div>
              </CommContainer>
            </div>
          </div>
        </div>

      </Container>
    </main>
  );
}
