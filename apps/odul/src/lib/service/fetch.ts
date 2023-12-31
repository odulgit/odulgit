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
  const workTree = dto.dir || process.cwd()

  const repository = dto.repository || await getRepoAddress({ workTree })

  const gitContract = await getGitContract(repository, true)

  let branch = dto.branch || ""

  let head

  fs.mkdirSync(`${workTree}/.git/refs/remotes/odul`, { recursive: true })
  if (dto.branch === undefined) { // fetch main branch
    const repo = await gitContract.repo()
    branch = repo.defaultBranch
    const commitHash = repo.latestCommit
    const cid = await gitContract.cid(commitHash)
    await downloadDir(cid, `${workTree}/.git`)
    head = commitHash.replace(/^0x/, "")
    fs.writeFileSync(`${workTree}/.git/refs/remotes/odul/HEAD`, `${head}\n`)
  } else {
    const [address, index] = dto.branch.split("/")
    const { cid } = (await gitContract.contributor(address, parseInt(index)))
    if (cid === "") {
      throw new Error("Branch not exist")
    }
    const bundleFile = await tempFile()
    fs.writeFileSync(bundleFile, await downloadFile(cid))
    head = (await runCommand("git", ["bundle", "list-heads", bundleFile])).stdout.substring(0, 40)
    await unBundle(bundleFile, { workTree })
  }

  fs.mkdirSync(`${workTree}/.git/refs/remotes/odul/${branch.substring(0, branch.lastIndexOf("/"))}`, { recursive: true })
  fs.writeFileSync(`${workTree}/.git/refs/remotes/odul/${branch}`, `${head}\n`)

  return { head, branch, repository }
}
