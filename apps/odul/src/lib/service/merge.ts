import fs from "node:fs"
import { getRepoAddress } from "../git/remote"
import { tempDir } from "../util/commands"
import { clone } from "./clone"
import { fetch } from "./fetch"
import { merge as gitMergeCommand } from "../git/merge"
import { uploadGitObjects } from "./init"
import { revParse } from "../git/rev-parse"
import { gc } from "../git/gc"
import { mergeToContract } from "../wallet/invoke"
import { catCommit } from "../git/cat-commit"

export const merge = async (dto: {
  branch: string
  gc: boolean
}) => {
  const repository = await getRepoAddress({ })

  const dir = await tempDir()

  const { branch: mainBranch } = await clone({ repository, directory: dir })

  const { head: newBranchHead } = await fetch({
    repository,
    dir,
    branch: dto.branch,
  })

  await gitMergeCommand(newBranchHead, `Merge branch ${dto.branch} into ${mainBranch}`, { workTree: dir })
  const head = await revParse("HEAD", { workTree: dir })

  if (dto.gc) {
    await gc({ workTree: dir })
  }

  const cid = await uploadGitObjects(dir)

  fs.cpSync(`${dir}/.git/objects`, `${process.cwd()}/.git/objects`, { recursive: true })
  fs.writeFileSync(`${process.cwd()}/.git/refs/remotes/odul/${mainBranch}`, `${head}\n`)
  fs.writeFileSync(`${process.cwd()}/.git/refs/remotes/odul/HEAD`, `${head}\n`)
  const commit = await catCommit(head)
  const [contributer, contributeId] = dto.branch.split("/")

  await mergeToContract(repository, commit, contributer, contributeId, cid)
}