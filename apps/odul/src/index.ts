#!/usr/bin/env node
import yargs from "yargs"

const usageText = `
odulgit - a bounty git tool
`
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const argv = yargs
  .commandDir("command", { extensions: ["js", "ts"], exclude: /\.d\.ts$/ })
  .strict()
  .demandCommand()
  .completion()
  .usage(usageText)
  .fail((msg, err, _yargs) => {
    console.error(err?.message || msg)
    if (process.env.DEBUG === "true") {
      console.error(err?.stack || err)
    }
    process.exit(1)
  })
  .argv
