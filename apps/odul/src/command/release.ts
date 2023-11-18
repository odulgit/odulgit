import type { Arguments, Argv } from "yargs"
import { release } from "../lib/service/release"

export const command = "release"

export const desc = "package and upload code to filecoin"

export interface OptType {
  commit: string
  tag: string
  type?: "lotus" | "lighthouse" | "deal"
}

export const builder = (yargs: Argv<OptType>) => {
  return yargs
    .option("commit", {
      type: "string",
      describe: "The commit to push",
    })
    .option("tag", {
      type: "string",
      describe: "The tag",
    })
    .option("type", {
      type: "string",
      choices: ["lotus", "lighthouse", "deal"],
      describe: "Upload to filecoin",
    })
}

export const handler = async (argv: Arguments<OptType>) => {
  await release(argv)
  process.exit(0)
}
