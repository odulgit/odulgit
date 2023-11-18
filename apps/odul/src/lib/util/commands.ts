import { runCommand } from "./async-run-command"

export const tempFile = async () => {
  const result = (await runCommand("mktemp")).stdout
  return result.split("\n")[0]
}

export const tempDir = async () => {
  const result = (await runCommand("mktemp", ["-d"])).stdout
  return result.split("\n")[0]
}
