'use client'

import * as React from "react"
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
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
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter, useSearchParams } from 'next/navigation';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { abi } from '@/service/Git/abi'

export default function Bounty() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const repoAddress = searchParams.get('address') ?? ''

  const [newDisscussion, setTotalBounty] = useState('Disscussion #')
  const [isDisabled, setDisabled] = useState(true)

  const formSchema = z.object({
    title: z.string().refine((value) => value !== ''),
    description: z.string().refine((value) => value !== ''),
    bounty: z.string().refine((value) => value !== ''),
    deadline: z.any(),
    markdown: z.string(),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      bounty: '',
      markdown: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Send Bounty Request')
    write?.()
  }

  // Prepare the contract
  const { config } = usePrepareContractWrite({
    address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    abi: abi,
    functionName: 'createBounty',
    args: [
      form.getValues().title,
      form.getValues().description
    ],
  })

  const { data, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  useEffect(() => {
    if (isSuccess) {
      router.push('/issues')
    }
  }, [isSuccess])

  useEffect(() => {
    setDisabled(!form.formState.isValid)
  }, [form.getValues()]);

  return (
    <main className='background'
      style={{
        minHeight: `100vh`,
      }}>
      <Container>
        <div className='flex flex-col'>
          <div className='m-24'>
            <div className='text-2xl mb-5 font-roboto-bold'>
              {newDisscussion}
            </div>
            <div className='flex flex-row issue-background'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="m-5 space-y-8 w-full">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-1.5xl'>Title of the discussion</FormLabel>
                        <FormControl>
                          <Input className="custom-input" placeholder="Type the discussion title here.." {...field} />
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
                        <FormLabel className='text-1.5xl'>Description of the discussion</FormLabel>
                        <FormControl>
                          <Input className="custom-input" placeholder="Type description here.." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row justify-between">
                    <FormField
                      control={form.control}
                      name="bounty"
                      render={({ field }) => (
                        <FormItem className="w-6/12 pr-10">
                          <FormLabel className="text-1.5xl">Issue Bounty</FormLabel>
                          <FormControl>
                            <div className='rt-input-input'>
                              <Input className="custom-input" placeholder="Set a bounty" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-6/12">
                          <FormLabel className="text-1.5xl">Deadline</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-auto pl-3 text-left font-normal custom-input",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Enter a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="markdown"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-1.5xl'>Markdown Editor</FormLabel>
                        <FormControl>
                          <Textarea className="custom-input" placeholder="Write your markdown here.." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row justify-center">
                    {/* <Button className="custom-cancel-btn mr-5" variant="outline">Cancel</Button> */}
                    <Button className="custom-cancel-btn mr-5" variant="outline" onClick={() => (router.push('/issues'))}>
                      Cancel
                    </Button>
                    <Button className="custom-send-btn ml-5" type="submit" disabled={isDisabled}>
                      {isLoading ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </Container>
    </main >
  );
}
