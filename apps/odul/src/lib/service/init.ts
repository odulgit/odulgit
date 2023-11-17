import fs from "node:fs"
import { createBundle } from "../git/bundle"
import { clone } from "../git/clone"
import { tempDir, tempFile } from "../util/commands"
import { uploadDir } from "../util/ipfs"
import { getGitFactoryContract } from "../wallet/contract"
import { runCommand } from "../util/async-run-command"
import { utils } from "ethers"
export const init = async (branch = "main") => {
  const commitHash = await runCommand("git", ["rev-parse", "HEAD"])
  const commitHashBytes = await utils.arrayify(`0x${commitHash.stdout?.trim()}`)
  const bundleFile = await tempFile()
  await createBundle(bundleFile, branch)
  const gitDir = await tempDir()
  await clone(bundleFile, gitDir, branch)
  const ipfsUploadDir = await tempDir()
  fs.mkdirSync(`${ipfsUploadDir}/.git`, { recursive: true })
  fs.cpSync(`${gitDir}/.git/objects`, `${ipfsUploadDir}/.git/objects`, {
    recursive: true,
  })
  fs.cpSync(`${gitDir}/.git/refs`, `${ipfsUploadDir}/.git/refs`, {
    recursive: true,
  })
  fs.cpSync(`${gitDir}/.git/HEAD`, `${ipfsUploadDir}/.git/HEAD`)

  const cid = await uploadDir(`${ipfsUploadDir}/.git`)

  const factory = await getGitFactoryContract()
  // TODO: save repo and branch to contract
  const tx = await factory.getRepoAddress(commitHashBytes, cid)
  const receipt = await tx.wait()
  const event = factory.interface.parseLog(receipt.logs[0])
  console.log("repo address:", event.args.repo)
}
