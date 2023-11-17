#!/usr/bin/env node
import yargs from "yargs"

const usageText = `
odulgit - a bounty git tool
`
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const argv = yargs
  .commandDir("lib")
  .strict()
  .demandCommand()
  .completion()
  .usage(usageText)
  .argv
