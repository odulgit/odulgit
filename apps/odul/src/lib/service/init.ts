import fs from "node:fs"
import { createBundle } from "../git/bundle"
import { clone } from "../git/clone"
import { tempDir, tempFile } from "../util/commands"
import { uploadDir } from "../util/ipfs"
import { getRepoAddress } from "../wallet/invoke"
import { utils } from "ethers"
import { setRepoAddress } from "../git/remote"
import { revParse } from "../git/rev-parse"
export const init = async (branch = "main") => {
  const commitHash = await revParse(branch)
  const commitHashBytes = await utils.arrayify(`0x${commitHash}`)
  const bundleFile = await tempFile()
  await createBundle(bundleFile, branch)
  const gitDir = await tempDir()
  await clone(bundleFile, gitDir, branch)

  const cid = await uploadGitObjects(gitDir)

  const repo = await getRepoAddress(commitHashBytes, cid)
  console.log("repo address:", repo)

  await setRepoAddress(repo)
  fs.mkdirSync(".git/refs/remotes/odul", { recursive: true })
  fs.writeFileSync(`.git/refs/remotes/odul/${branch}`, `${commitHash}\n`)
  fs.writeFileSync(".git/refs/remotes/odul/HEAD", `${commitHash}\n`)
}

export const uploadGitObjects = async (dir: string) => {
  const ipfsUploadDir = await tempDir()
  fs.mkdirSync(`${ipfsUploadDir}/.git`, { recursive: true })
  fs.cpSync(`${dir}/.git/objects`, `${ipfsUploadDir}/.git/objects`, {
    recursive: true,
  })

  const cid = await uploadDir(`${ipfsUploadDir}/.git`)

  return cid
}
