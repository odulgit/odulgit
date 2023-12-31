import fs from "node:fs"
import { fetch } from "./fetch"
import { tempFile } from "../util/commands"
import { createBundle } from "../git/bundle"
import { uploadFile } from "../util/ipfs"
import { revList } from "../git/rev-list"
import { catCommit } from "../git/cat-commit"
import { pushToContract } from "../wallet/invoke"
import { sendNotify } from "../util/notifty"

export const push = async (dto: {
  branch?: string
  target?: string // if target === undefined -> create new branch on contract
}) => {
  const { head: remoteHead, repository: repoAddr } = await fetch({ })

  const bundleFile = await tempFile()

  const commitPath = `${remoteHead}..${dto.branch || "HEAD"}`

  const commits = await Promise.all((await revList(commitPath)).reverse().map(catCommit))
  if (commits.some(commit => commit.parents.length !== 1)) {
    throw Error("Push branch with merge to odul is not yet complete")
  }

  await createBundle(bundleFile, commitPath)
  const cid = await uploadFile(fs.readFileSync(bundleFile))

  const contribute = await pushToContract(repoAddr, commits, cid)
  const [contributor, contributeId] = contribute.split("/")
  await sendNotify(contributor, "5c2cc8c3-3e06-4d71-b7ac-011d2beff331", "You make a contribution!", JSON.stringify({ repo: repoAddr, contributeId }))
  console.log(contribute)
}
