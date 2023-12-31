import fs from "node:fs"
import { reset } from "../git/reset"
import { fetch } from "./fetch"
import { setRepoAddress } from "../git/remote"
import { getGitContract } from "../wallet/contract"

export const clone = async (dto: {
  repository: string
  directory?: string
}) => {
  const dir = dto.directory || (await (await getGitContract(dto.repository, true)).repo()).name
  const gitDir = `${dir}/.git`

  if (fs.existsSync(gitDir)) {
    throw new Error("direction is existed")
  }

  const { head, branch } = await fetch({
    repository: dto.repository,
    dir,
  })
  fs.mkdirSync(`${gitDir}/refs/heads`, { recursive: true })
  fs.writeFileSync(`${gitDir}/refs/heads/${branch}`, `${head}\n`)
  fs.writeFileSync(`${gitDir}/HEAD`, `ref: refs/heads/${branch}\n`)
  await reset("hard", "HEAD", { dir: `${dir}/.git`, workTree: dir })

  await setRepoAddress(dto.repository, { dir: gitDir, workTree: dir })

  return { head, branch }
}
