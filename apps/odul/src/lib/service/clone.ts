import fs from "node:fs"
import { downloadDir } from "../util/ipfs"
import { reset } from "../git/reset"
import { getGitContract } from "../wallet/contract"
import { remoteAdd } from "../git/remote-add"

export const clone = async (dto: {
  repository: string
  directory?: string
}) => {
  // TODO: get repo and branch from contract
  const repo = dto.repository
  const branch = "main"

  const gitContract = await getGitContract(repo)

  const commitHash = await gitContract.getLatestPack()
  console.log(commitHash)
  const cid = await gitContract.cid(commitHash)
  console.log(cid)
  const dir = dto.directory || repo

  if (fs.existsSync(dir)) {
    throw new Error("direction is existed")
  }

  fs.mkdirSync(`${dir}/.git`, { recursive: true })

  await downloadDir(cid, `${dir}/.git`)

  await reset("hard", "HEAD", { dir: `${dir}/.git`, workTree: dir })

  await remoteAdd("odul", dto.repository, { dir: `${dir}/.git`, workTree: dir })
  fs.mkdirSync(`${dir}/.git/refs/remotes/odul`, { recursive: true })
  fs.writeFileSync(`${dir}/.git/refs/remotes/odul/HEAD`, `${commitHash.replace(/^0x/, "")}\n`)
  fs.writeFileSync(`${dir}/.git/refs/remotes/odul/${branch}`, `${commitHash.replace(/^0x/, "")}\n`)
}
