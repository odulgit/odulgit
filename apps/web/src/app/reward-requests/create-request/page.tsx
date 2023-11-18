'use client'

import * as React from "react"
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button'
import { useState } from 'react'
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

export default function RR() {
  const formSchema = z.object({
    title: z.string(),
    description: z.string(),
    from: z.string(),
    to: z.boolean(),
    linkIssue: z.string(),
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
    { id: "main", name: "main" },
    { id: "develop", name: "develop" },
  ];

  const issueList = [
    { id: "feat/deposit", name: "feat/deposit" },
    { id: "feat/withdraw", name: "feat/withdraw" },
  ];

  const [fromBranches, setFromBranches] = useState(branchList)
  const [issues, setIssues] = useState(issueList)

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
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
                    <Button className="custom-send-btn ml-5" type="submit">Send Pull Request</Button>
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
