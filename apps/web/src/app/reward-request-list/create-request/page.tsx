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
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { abi } from '@/service/Git/abi'
import { useRouter, useSearchParams } from 'next/navigation';

export default function RR() {
  const searchParams = useSearchParams()
  const repoAddress = searchParams.get('address') ?? ''
  const formSchema = z.object({
    title: z.string().refine((value) => value !== ''),
    description: z.string().refine((value) => value !== ''),
    from: z.string().refine((value) => value !== ''),
    to: z.boolean().refine((value) => value !== false),
    linkIssue: z.string().refine((value) => value !== ''),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      from: '',
      to: false,
      linkIssue: '',
    },
  })

  const branchList = [
    { id: "1", name: "main" },
    { id: "2", name: "develop" },
  ];

  const issueList = [
    { id: "1", name: "feat/deposit" },
    { id: "2", name: "feat/withdraw" },
  ];

  const [fromBranches, setFromBranches] = useState(branchList)
  const [issues, setIssues] = useState(issueList)
  const [isDisabled, setDisabled] = useState(true)

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Send Reward Request')
    write?.()
  }

  // Prepare the contract
  const { config } = usePrepareContractWrite({
    address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    abi: abi,
    functionName: 'rewardRequest',
    args: [
      parseInt(form.getValues().from),
      form.getValues().title
    ],
  })

  const { data, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      router.push('/repos')
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
              Send Pull Request
            </div>
            {/* <div className='flex issue-background'> */}
            <CommContainer>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="m-5 space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-1.5xl'>Repository title</FormLabel>
                        <FormControl>
                          <Input className="custom-input" placeholder="Type the repository title here.." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-1.5xl'>Repository description</FormLabel>
                        <FormControl>
                          <Input className="custom-input" placeholder="Description for this repository.." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row justify-between">
                    <FormField
                      control={form.control}
                      name="from"
                      render={({ field }) => (
                        <FormItem className="flex-1 pr-10">
                          <FormLabel className="text-1.5xl">From branch</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fromBranches.map((branch, index) => (
                                <SelectItem value={branch.id}>{branch.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                  <FormField
                    control={form.control}
                    name="linkIssue"
                    render={({ field }) => (
                      <FormItem className="w-6/12 pr-10">
                        <FormLabel className='text-1.5xl'>Link to Issue</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose Issue" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {issues.map((issue, index) => (
                              <SelectItem value={issue.id}>{issue.name}</SelectItem>
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
