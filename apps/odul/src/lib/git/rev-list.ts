import { runCommand } from "../util/async-run-command"

export const revList = async (
  commit: string,
) => {
  const result = await runCommand(
    "git",
    [
      "rev-list",
      commit,
    ],
  )
  return result.stdout!.trim().split("\n")
}
