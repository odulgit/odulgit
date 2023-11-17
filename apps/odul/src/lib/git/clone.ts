import { runCommand } from "../util/async-run-command"

export const clone = async (
  repository: string,
  directory: string,
  branch?: string,
) => {
  const result = await runCommand(
    "git",
    ["clone"]
      .concat(branch ? ["--branch", branch] : [])
      .concat([repository, directory]),
  )
  return result
}
