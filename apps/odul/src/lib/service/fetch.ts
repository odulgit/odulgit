import fs from "node:fs"
import { downloadDir, downloadFile } from "../util/ipfs"
import { getGitContract } from "../wallet/contract"
import { getRepoAddress } from "../git/remote"
import { tempFile } from "../util/commands"
import { runCommand } from "../util/async-run-command"
import { unBundle } from "../git/bundle"

export const fetch = async (dto: {
  repository?: string
  dir?: string
  branch?: string // if branch = undefined -> fetch main branch
}) => {
  const isFetchMainBranch = dto.branch === undefined
  const workTree = dto.dir || process.cwd()

  const repository = dto.repository || await getRepoAddress({ workTree })

  const gitContract = getGitContract(repository)

  let branch = dto.branch || ""

  let head

  fs.mkdirSync(`${workTree}/.git/refs/remotes/odul`, { recursive: true })
  if (isFetchMainBranch) { // fetch main branch
    // TODO: get repo and branch from contract
    branch = "main"
    const commitHash = await gitContract.getLatestPack()
    const cid = await gitContract.cid(commitHash)
    await downloadDir(cid, `${workTree}/.git`)
    head = commitHash.replace(/^0x/, "")
    fs.writeFileSync(`${workTree}/.git/refs/remotes/odul/HEAD`, `${head}\n`)
  } else {
    // TODO: get cid from contract
    const cid = "QmPU12gPkjsmxuoCcA42YUfVaXE7Rr4v9YHEc7nQGxL5ar"
    const bundleFile = await tempFile()
    fs.writeFileSync(bundleFile, await downloadFile(cid))
    head = (await runCommand("git", ["bundle", "list-heads", bundleFile])).stdout.substring(0, 40)
    await unBundle(bundleFile, { workTree })
  }

  fs.writeFileSync(`${workTree}/.git/refs/remotes/odul/${branch}`, `${head}\n`)

  return { head, branch, repository }
}
