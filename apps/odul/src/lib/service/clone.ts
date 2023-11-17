import fs from "node:fs"
import { downloadDir } from "../util/ipfs"
import { reset } from "../git/reset"

export const clone = async (dto: {
  repository: string
  directory?: string
}) => {
  // TODO: get repo and cid from contract
  const repo = dto.repository
  const cid = "QmT5SVrnKPDe1sUcZP7nSm669q3mvuebfTxbTNYgLpnyLa"

  const dir = dto.directory || repo

  if (fs.existsSync(dir)) {
    throw new Error("direction is existed")
  }

  fs.mkdirSync(`${dir}/.git`, { recursive: true })

  await downloadDir(cid, `${dir}/.git`)

  await reset("hard", "HEAD", { dir: `${dir}/.git`, workTree: dir })
}
