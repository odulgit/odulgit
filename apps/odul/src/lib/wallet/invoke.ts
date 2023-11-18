import { getGitFactoryContract, getGitContract } from "./contract"
import { utils } from "ethers"
interface Commit {
  hash: string
  content: string
  tree: string
  parents: string[]
  msg: string
}

const strToBytes = (str: string) => {
  return utils.arrayify(Buffer.from(str, "utf-8"))
}

const catCommitPayload = (commit: Commit) => {
  const thisHash = utils.arrayify(`0x${commit.hash}`)
  const wordCount = strToBytes(`${commit.content.length}\0`)
  const tree = utils.arrayify(`0x${commit.tree}`)
  const parents = commit.parents.map(parent => utils.arrayify(`0x${parent}`))
  const message = utils.arrayify(strToBytes(commit.msg))
  return {
    thisHash,
    wordCount,
    tree,
    parents,
    message,
  }
}
export const getRepoAddress = async (commitHashBytes: Uint8Array, name: string, cid: string, defaultBranch: string) => {
  const factory = await getGitFactoryContract()
  const tx = await factory.getRepoAddress(commitHashBytes, name, cid, defaultBranch)
  const receipt = await tx.wait()
  console.log(receipt)
  const event = factory.interface.parseLog(receipt.logs[0])

  const repo = event.args.repo
  return repo
}

export const pushToContract = async (repoAddr: string, commits: Commit[], cid: string) => {
  const repo = await getGitContract(repoAddr)
  const commit = commits.map(commit => catCommitPayload(commit))

  try {
    // TODO: correct the sha1 of push
    const tx = await repo.push(commit, cid)
    const receipt = await tx.wait()
    const event = repo.interface.parseLog(receipt.logs[receipt.logs.length - 1])
    return `${event.args.contributer}/${event.args.contributeID}`
  } catch (e: any) {
    if (e?.error?.reason) {
      throw new Error(e?.error?.reason)
    }
    throw e
  }
}

export const mergeToContract = async (repoAddr: string, commit: Commit, contributer: string, contributeId: string, cid: string) => {
  const repo = await getGitContract(repoAddr)

  try {
    await repo.merge(catCommitPayload(commit), contributer, contributeId, cid)
  } catch (e: any) {
    if (e?.error?.reason) {
      throw new Error(e?.error?.reason)
    }
    throw e
  }
}
