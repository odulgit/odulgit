import fs from "node:fs"
import { getRepoAddress } from "../git/remote"
import { tempDir } from "../util/commands"
import { getGitContract } from "../wallet/contract"
import { reset } from "../git/reset"
import { utils } from "ethers"
import tar from "tar"
import { downloadDir, uploadFile } from "../util/ipfs"
import { upload } from "../storage/fileUpload"
import { deal } from "../storage/fileDeal"
import { lotusUpload } from "../storage/lotus"

export const release = async (dto: {
  commit: string
  tag: string
  type?: "lotus" | "lighthouse" | "deal"
}) => {
  const repository = await getRepoAddress({ })

  const gitContract = await getGitContract(repository, true)

  if (!(await gitContract.mainCommitExist(utils.arrayify(`0x${dto.commit}`)))) {
    throw new Error("commit not in main branch")
  }

  const cid = await gitContract.cid(utils.arrayify(`0x${dto.commit}`))
  const name = (await gitContract.repo()).name

  const tempFolder = await tempDir()

  const directory = `${tempFolder}/${name}`
  fs.mkdirSync(directory)

  await downloadDir(cid, `${directory}/.git`)

  fs.mkdirSync(`${directory}/.git/refs/heads`, { recursive: true })
  fs.writeFileSync(`${directory}/.git/refs/heads/main`, `${dto.commit}\n`)
  fs.writeFileSync(`${directory}/.git/HEAD`, "ref: refs/heads/main\n")
  await reset("hard", "HEAD", { workTree: directory })

  fs.rmSync(`${directory}/.git`, { recursive: true, force: true })

  const file = `${tempFolder}/${dto.commit}.tar.gz`
  await new Promise((resolve, reject) => {
    tar.c(
      {
        gzip: true,
        file,
        cwd: tempFolder,
      },
      [name],
    ).then(resolve).catch(reject)
  })

  console.log(file)

  if (dto.type === "lighthouse") {
    const { data: { Hash: hash } } = await upload(file)
    console.log(`lighthouse: ${hash}`)
  }
  if (dto.type === "deal") {
    await deal(file)
  }
  if (dto.type === "lotus") {
    const cid = await uploadFile(fs.readFileSync(file))
    await lotusUpload(cid)
  }
}
