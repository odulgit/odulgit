import type { Argv } from "yargs"
import { init } from "../lib/service/init"

export const command = "init"

export const desc = "init repo"

export const builder = (yargs: Argv) => {
  return yargs
}

export const handler = async () => {
  await init()
  process.exit(0)
}
