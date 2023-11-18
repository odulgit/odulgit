import type { Arguments, Argv } from "yargs"
import { setConfigByName } from "../../lib/service/config"

export const command = "set <name> <value>"

export const desc = "set setting"

export interface OptType {
  name: string
  value: string
}

export const builder = (yargs: Argv<OptType>) => {
  return yargs
    .positional("name", {
      type: "string",
      describe: "config name",
    })
    .positional("value", {
      type: "string",
      describe: "config value",
    })
}

export const handler = (argv: Arguments<OptType>) => {
  setConfigByName(argv.name, argv.value)
}
