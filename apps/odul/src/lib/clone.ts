import { Argv } from "yargs"

export const command = "clone"

export const desc = "clone data"

export const builder = (yargs: Argv<any>) => {
  return yargs
}

export const handler = () => {
}
