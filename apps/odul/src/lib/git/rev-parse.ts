import { runCommand } from "../util/async-run-command"
import { GitOption, getEnv } from "./options"

export const revParse = async (
  branch: string,
  options?: GitOption,
) => {
  return (await runCommand(
    "git",
    [
      "rev-parse",
      branch,
    ],
    getEnv(options),
  )).stdout.trim()
}
