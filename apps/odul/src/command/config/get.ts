import type { Arguments, Argv } from "yargs"
import { getConfigByName, setConfigByName } from "../../lib/service/config"

export const command = "get <name>"

export const desc = "get setting"

export interface OptType {
  name: string
}

export const builder = (yargs: Argv<OptType>) => {
  return yargs
    .positional("name", {
      type: "string",
      describe: "config name",
    })
}

export const handler = (argv: Arguments<OptType>) => {
  console.info(getConfigByName(argv.name))
}
