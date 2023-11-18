import { runCommand } from "../util/async-run-command"
import { GitOption, getEnv } from "./options"

export const merge = async (
  commit: string,
  message: string,
  options?: GitOption,
) => {
  const result = await runCommand(
    "git",
    [
      "merge",
      "--no-ff",
      "-m",
      message,
      commit,
    ],
    getEnv(options),
  )
  return result
}
