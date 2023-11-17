import { sha1 } from "../util/sha1"
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
  // console.log("wc", `0x${Buffer.from(strToBytes(`commit ${commit.content.length}\0`)).toString("hex")}`)
  // console.log("tree", `0x${Buffer.from(strToBytes(`tree ${commit.tree}\n`)).toString("hex")}`)
  // console.log("parents", commit.parents.map(parent => `0x${Buffer.from(strToBytes(`parent ${parent}\n`)).toString("hex")}`).join(""))
  // console.log("msg", `0x${Buffer.from(strToBytes(commit.msg)).toString("hex")}`)
  // console.log("----")
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
export const getRepoAddress = async (commitHashBytes: Uint8Array, cid: string) => {
  const factory = await getGitFactoryContract()
  const tx = await factory.getRepoAddress(commitHashBytes, cid)
  const receipt = await tx.wait()
  const event = factory.interface.parseLog(receipt.logs[0])

  const repo = event.args.repo
  return repo
}

export const pushToContract = async (repoAddr: string, commits: Commit[], cid: string) => {
  const factory = await getGitContract(repoAddr)
  const commit = commits.map(commit => catCommitPayload(commit))

  try {
    // TODO: correct the sha1 of push
    const tx = await factory.push(commit, cid)
    const receipt = await tx.wait()
    const event = factory.interface.parseLog(receipt.logs[0])
    console.log(event.args.sha)
  } catch (e: any) {
    console.log(e)
    if (e && e.reason) {
      console.log(e)
    }
  }
}
