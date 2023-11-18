import { type Arguments, type Argv } from "yargs"
import { merge } from "../lib/service/merge"

export const command = "merge <branch>"

export const desc = "merge branch into main"

export interface OptType {
  branch: string
  message?: string
  gc: boolean
}

export const builder = (yargs: Argv<OptType>) => {
  return yargs
    .positional("branch", {
      type: "string",
      describe: "The branch to merge",
    })
    .option("message", {
      type: "string",
      describe: "Set the commit message to be used for the merge commit",
      alias: "m",
    })
    .option("gc", {
      type: "boolean",
      describe: "Cleanup unnecessary files and optimize the local repository",
      default: false,
    })
}

export const handler = async (argv: Arguments<OptType>) => {
  await merge(argv)
  process.exit(0)
}
