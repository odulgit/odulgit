import fs from "node:fs"
import { createBundle } from "../git/bundle"
import { clone } from "../git/clone"
import { tempDir, tempFile } from "../util/commands"
import { uploadDir } from "../util/ipfs"
import { getGitFactoryContract } from "../wallet/contract"
import { runCommand } from "../util/async-run-command"
import { utils } from "ethers"
import { setRepoAddress } from "../git/remote"
export const init = async (branch = "main") => {
  const commitHash = (await runCommand("git", ["rev-parse", branch])).stdout?.trim()
  const commitHashBytes = await utils.arrayify(`0x${commitHash}`)
  const bundleFile = await tempFile()
  await createBundle(bundleFile, branch)
  const gitDir = await tempDir()
  await clone(bundleFile, gitDir, branch)
  const ipfsUploadDir = await tempDir()
  fs.mkdirSync(`${ipfsUploadDir}/.git`, { recursive: true })
  fs.cpSync(`${gitDir}/.git/objects`, `${ipfsUploadDir}/.git/objects`, {
    recursive: true,
  })

  const cid = await uploadDir(`${ipfsUploadDir}/.git`)

  const factory = await getGitFactoryContract()
  // TODO: save repo and branch to contract
  const tx = await factory.getRepoAddress(commitHashBytes, cid)
  const receipt = await tx.wait()
  const event = factory.interface.parseLog(receipt.logs[0])

  const repo = event.args.repo
  console.log("repo address:", repo)

  await setRepoAddress(repo)
  fs.mkdirSync(".git/refs/remotes/odul", { recursive: true })
  fs.writeFileSync(`.git/refs/remotes/odul/${branch}`, `${commitHash}\n`)
  fs.writeFileSync(".git/refs/remotes/odul/HEAD", `${commitHash}\n`)
}
