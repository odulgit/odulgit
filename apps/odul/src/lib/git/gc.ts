import { runCommand } from "../util/async-run-command"
import { GitOption, getEnv } from "./options"

export const gc = async (
  options?: GitOption,
) => {
  const result = await runCommand(
    "git",
    [
      "gc",
    ],
    getEnv(options),
  )
  return result
}
