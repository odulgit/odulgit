import { runCommand } from "../util/async-run-command"

export const createBundle = async (file: string, revList: string) => {
  const result = await runCommand("git", ["bundle", "create", file, revList])
  return result
}
