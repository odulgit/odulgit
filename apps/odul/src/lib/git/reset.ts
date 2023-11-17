import { runCommand } from "../util/async-run-command"
import { GitOption, getEnv } from "./options"

export const reset = async (
  type: "soft" | "mixed" | "hard",
  commit: string,
  options?: GitOption,
) => {
  const result = await runCommand(
    "git",
    [
      "reset",
      `--${type}`,
      commit,
    ],
    options && getEnv(options),
  )
  return result
}
