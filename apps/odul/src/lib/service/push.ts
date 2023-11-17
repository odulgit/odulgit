import fs from "node:fs"
import { fetch } from "./fetch"
import { tempFile } from "../util/commands"
import { createBundle } from "../git/bundle"
import { uploadFile } from "../util/ipfs"
import { revList } from "../git/rev-list"
import { catCommit } from "../git/cat-commit"

export const push = async (dto: {
  branch?: string
  target?: string // if target === undefined -> create new branch on contract
}) => {
  const { head: remoteHead } = await fetch({ })

  const bundleFile = await tempFile()

  const commitPath = `${remoteHead}..${dto.branch || "HEAD"}`

  const commits = await Promise.all((await revList(commitPath)).reverse().map(catCommit))

  if (commits.some(commit => commit.parents.length !== 1)) {
    throw Error("Push branch with merge to odul is not yet complete")
  }

  await createBundle(bundleFile, commitPath)
  const cid = await uploadFile(fs.readFileSync(bundleFile))

  // TODO: upload commits and cid to contract
  console.log(`cid: ${cid}`)
  console.log(`commits: ${commits.map(commit => commit.hash)}`)
}
