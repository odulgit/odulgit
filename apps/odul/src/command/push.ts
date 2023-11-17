import type { Arguments, Argv } from "yargs"
import { push } from "../lib/service/push"

export const command = "push"

export const desc = "push branch"

export interface OptType {
  branch?: string
  target?: string
}

export const builder = (yargs: Argv<OptType>) => {
  return yargs
    .option("branch", {
      type: "string",
      describe: "The branch to push",
      alias: "b",
    })
    .option("target", {
      type: "string",
      describe: "The remote branch to push",
    })
}

export const handler = async (argv: Arguments<OptType>) => {
  await push(argv)
}
