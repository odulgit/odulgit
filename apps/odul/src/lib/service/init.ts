import fs from "node:fs"
import { createBundle } from "../git/bundle"
import { clone } from "../git/clone"
import { tempDir, tempFile } from "../util/commands"
import { uploadDir } from "../util/ipfs"

export const init = async (branch = "main") => {
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

  // TODO: deploy contract
  console.log(cid)
}
