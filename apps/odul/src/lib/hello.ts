import { Argv } from "yargs"
import { hello } from "./service/hello"

export const command = "hello"

export const desc = "hello world"

export const builder = (yargs: Argv<any>) => {
  return yargs
}

export const handler = () => {
  hello()
}
