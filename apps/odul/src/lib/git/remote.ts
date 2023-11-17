import { runCommand } from "../util/async-run-command"
import { GitOption, getEnv } from "./options"

export const remoteAdd = async (
  name: string,
  url: string,
  options?: GitOption,
) => {
  const result = await runCommand(
    "git",
    [
      "remote",
      "add",
      name,
      url,
    ],
    options && getEnv(options),
  )
  return result
}

export const remoteGet = async (
  name: string,
  options?: GitOption,
) => {
  const result = await runCommand(
    "git",
    [
      "remote",
      "get-url",
      name,
    ],
    options && getEnv(options),
  )
  return result.stdout
}

export const setRepoAddress = async (address: string, option?: GitOption) => {
  await remoteAdd("odul", address, option)
}

export const getRepoAddress = async (option?: GitOption) => {
  const address = await remoteGet("odul", option)
  if (!address) {
    throw new Error("odul repo address not set in git remote")
  }
  return address.trim()
}
