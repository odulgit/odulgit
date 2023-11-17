import { type Arguments, type Argv } from "yargs"
import { fetch } from "../lib/service/fetch"

export const command = "fetch [branch]"

export const desc = "fetch branch or remote head"

export interface OptType {
  branch?: string
}

export const builder = (yargs: Argv<OptType>) => {
  return yargs
    .positional("branch", {
      type: "string",
      describe: "The branch to merge",
    })
}

export const handler = async (argv: Arguments<OptType>) => {
  await fetch(argv)
}
