'use client'

import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { TopBountyCard } from '@/components/Card/top-bounty-card';
import { useRouter } from 'next/navigation'

export default function Home() {
  const mockTopBountyRepo = [
    {
      title: "Trending Repo 1",
      description: "Description for trending repo 1.See what the GitHub community is most excited about today.",
      contract: "repo1",
      bounty: 80
    },
    {
      title: "Trending Repo 2",
      description: "Description for trending repo 1.See what the GitHub community is most excited about today.",
      contract: "repo2",
      bounty: 70
    },
    {
      title: "Trending Repo 3",
      description: "Description for trending repo 1.See what the GitHub community is most excited about today.",
      contract: "repo3",
      bounty: 60
    },
  ]
  const [totalBounty, setTotalBounty] = useState('6,750,500')
  const [topBountyRepos, setBountyRepo] = useState(mockTopBountyRepo)
  const router = useRouter()
  return (
    <main className='background-home pt-16'
      style={{
        minHeight: `100vh`,
      }}>
      <Container>
        <div className='flex items-center justify-center flex-col mt-6'>
          <div className='w-fit mr-28'>
            <div className='font-roboto text-5xl font-bold leading-14'>
              A Repository Place
            </div>
            <div className='font-roboto-normal text-xl mb-6'>Used by leading enterprises</div>
            <Button variant="home" size="home" onClick={() => (router.push('/repo-list'))} >Get Started</Button>
          </div>
          <div className='custom-text text-6xl mt-36'>
            Ξ {totalBounty}
          </div>
          <div>
            (Total Bounty)
          </div>
          <div className='flex flex-row mt-5 mb-5 space-x-2'>
            {topBountyRepos.map((repo, index) => (
              <TopBountyCard
                key={index}
                title={repo.title}
                description={repo.description}
                contract={repo.contract}
                bounty={repo.bounty}
              />

            ))}
          </div>
        </div>
      </Container>
    </main >
  );
}
