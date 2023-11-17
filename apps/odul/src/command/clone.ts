import type { Arguments, Argv } from "yargs"
import { clone } from "../lib/service/clone"

export const command = "clone <repository> [directory]"

export const desc = "clone data"

export interface OptType {
  repository: string
  directory?: string
}

export const builder = (yargs: Argv<OptType>) => {
  return yargs
    .positional("repository", {
      type: "string",
      describe: "The repository contract address to clone from.",
    })
    .positional("directory", {
      type: "string",
      describe: "The name of a new directory to clone into",
    })
}

export const handler = async (argv: Arguments<OptType>) => {
  await clone(argv)
}
