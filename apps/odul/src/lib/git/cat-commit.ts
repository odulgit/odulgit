import { runCommand } from "../util/async-run-command"

export const catCommit = async (hash: string) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = (await runCommand("git", ["cat-file", "commit", hash]))
    .stdout!
  return result
}
