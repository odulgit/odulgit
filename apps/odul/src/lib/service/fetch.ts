import fs from "node:fs"
import { downloadDir } from "../util/ipfs"
import { getGitContract } from "../wallet/contract"
import { getRepoAddress } from "../git/remote"

export const fetch = async (dto: {
  repository?: string
  gitDir?: string
  branch?: string // if branch = undefined -> fetch main branch
}) => {
  const isFetchMainBranch = dto.branch === undefined
  const gitDir = dto.gitDir || `${process.cwd()}/.git`

  const repository = dto.repository || await getRepoAddress({ dir: gitDir })

  const gitContract = await getGitContract(repository)

  let branch = dto.branch || ""

  let head

  if (isFetchMainBranch) { // fetch main branch
    // TODO: get repo and branch from contract
    branch = "main"
    const commitHash = await gitContract.getLatestPack()
    const cid = await gitContract.cid(commitHash)
    await downloadDir(cid, gitDir)
    head = commitHash.replace(/^0x/, "")
  } else {
    // TODO
    head = "123123123123123123123"
  }

  fs.mkdirSync(`${gitDir}/refs/remotes/odul`, { recursive: true })
  fs.writeFileSync(`${gitDir}/refs/remotes/odul/${branch}`, `${head}\n`)

  if (isFetchMainBranch) {
    fs.writeFileSync(`${gitDir}/refs/remotes/odul/HEAD`, `${head}\n`)
  }

  return { head, branch }
}
