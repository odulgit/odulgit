import { runCommand } from "../util/async-run-command"

export const catCommit = async (hash: string) => {
  const content = (await runCommand("git", ["cat-file", "commit", hash])).stdout!

  const tree = content.match(/^tree .{40}(?=\n)/)![0]
  const parents = Array.from(
    content.match(/(?<=^tree .{40}\n)(.|\n)*?(?=author)/)![0]
      .matchAll(/(?<=parent ).{40}(?=\n)/g)).map(match => match[0],
  )
  const msg = content.match(/author(.|\n)*$/)![0]
  return { hash, content, tree, parents, msg }
}
