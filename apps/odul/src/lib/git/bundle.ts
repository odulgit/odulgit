import { runCommand } from "../util/async-run-command"
import { GitOption, getEnv } from "./options"

export const createBundle = async (file: string, revList: string) => {
  const result = await runCommand("git", ["bundle", "create", file, revList])
  return result
}

export const unBundle = async (file: string, options?: GitOption) => {
  const result = await runCommand("git", ["bundle", "unbundle", file], getEnv(options))
  return result
}
