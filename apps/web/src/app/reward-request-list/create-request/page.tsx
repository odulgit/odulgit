'use client'

import * as React from "react"
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from '@/components/ui/checkbox'
import CommContainer from "@/components/common-container";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead } from 'wagmi'
import { abi } from '@/service/Git/abi'
import { useRouter, useSearchParams } from 'next/navigation';
import { Address } from 'viem'
import { BountyData, getBountyList, getRepo, RepoData } from '@/service/Git/contract'
import { useAccount } from 'wagmi'

export default function RR() {
  const [bountyList, setBountyList] = useState<BountyData[]>([])
  const [repo, setRepo] = useState<RepoData>()
  const { address, isConnected } = useAccount()
  const [readCommit, setCommit] = useState()

  const searchParams = useSearchParams()
  const repoAddress = searchParams.get('address') ?? ''
  const formSchema = z.object({
    contributeId: z.string().refine((value) => value !== ''),
    bountyId: z.string().refine((value) => value !== ''),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contributeId: '',
      bountyId: ''
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const bounties: BountyData[] = await getBountyList(repoAddress)
      setBountyList(bounties)
      const repo: RepoData = await getRepo(repoAddress)
      setRepo(repo)
    }
    fetchData()
  }, [])



  const [isDisabled, setDisabled] = useState(true)

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Send Reward Request')
    write?.()
  }

  const { data: bundle, isError, isLoading: isReadCommitLoading } = useContractRead({
    address: repoAddress as Address,
    abi: abi,
    functionName: 'contribute',
    args: [
      address,
      form.getValues().contributeId,
    ],
  })

  useEffect(() => {
    if (bundle) {
      setCommit(bundle?.sha)
    }
  }, [isReadCommitLoading])

  console.log("bundle:", bundle)

  // Prepare the contract
  const { config } = usePrepareContractWrite({
    address: repoAddress as Address,
    abi: abi,
    functionName: 'rewardRequest',
    args: [
      form.getValues().contributeId,
      form.getValues().bountyId
    ],
  })

  const { data, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      router.push('/repo-list')
    }
  }, [isSuccess])

  useEffect(() => {
    setDisabled(!form.formState.isValid)
  }, [form.getValues()]);

  return (
    <main className='background min-h-screen'>
      <Container>
        <div className='flex flex-col'>
          <div className='m-24'>
            <div className='text-2xl mb-5 font-roboto-bold'>
              Send Reward Request
            </div>
            {/* <div className='flex issue-background'> */}
            <CommContainer>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="m-5 space-y-8">
                  <div className="text-2xl mb-5 font-roboto-bold">
                    Repository - {repo?.name}
                  </div>

                  <div className="flex flex-row justify-between">
                    <FormField
                      control={form.control}
                      name="contributeId"
                      render={({ field }) => (
                        <FormItem className="flex-1 pr-10">
                          <FormLabel className='text-1.5xl'>From Contribute ID</FormLabel>
                          <FormControl>
                            <Input className="custom-input" placeholder="Type your contribute id here.." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="to"
                      render={({ field }) => (
                        <FormItem className="flex-1 pr-10">
                          <div className="flex flex-col">
                            <FormLabel className="text-1.5xl">To branch</FormLabel>
                            <div className="flex flex-row space-x-2 mt-4">
                              <FormControl>
                                <Checkbox
                                  className="it"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="leading-none">
                                <FormLabel>
                                  Merge to main
                                </FormLabel>
                              </div>
                            </div>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  {readCommit
                    ? <div className="flex flex-col">
                      <div className="text-1.5xl">
                        Prepare to merge
                      </div>
                      <div>
                        readCommit
                      </div>
                    </div>
                    : null
                  }
                  <FormField
                    control={form.control}
                    name="bountyId"
                    render={({ field }) => (
                      <FormItem className="w-6/12 pr-10">
                        <FormLabel className='text-1.5xl'>Link to Bounty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose Bounty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bountyList.map((bounty, index) => (
                              <SelectItem value={bounty.id.toString()}>{bounty.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row justify-center">
                    <Button className="custom-cancel-btn mr-5" variant="outline">Cancel</Button>
                    <Button className="custom-send-btn ml-5" type="submit" disabled={isDisabled}>
                      {isLoading ? 'Sending...' : 'Send Pull Request'}
                    </Button>
                  </div>
                </form>
              </Form>
              {/* </div> */}
            </CommContainer>

          </div>
        </div>
      </Container>
    </main>
  );
}
