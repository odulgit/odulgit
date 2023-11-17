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
