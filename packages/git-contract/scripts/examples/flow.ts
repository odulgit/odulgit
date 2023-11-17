import { ethers, utils, BytesLike } from "ethers"
import { config as dotenvConfig } from "dotenv"
import { resolve } from "path"
import { loadContract } from "../config"
dotenvConfig({ path: resolve(__dirname, "../../.env") })

async function main () {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NETWORK_URL)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as BytesLike, provider)

  // any chain you want
  const { abi, address } = loadContract("quorum", "GitFactory")
  const gitFactory = new ethers.Contract(address.main, abi.abi, wallet)

  console.log("---------- Git Factory ----------")
  const commitHash = ethers.utils.arrayify("0x7a84c004625e5b1b037b3083f583b52d9f7a3005")
  const gitInit = await gitFactory.getRepoAddress(
    commitHash,
    "testCID",
  )
  const receipt = await gitInit.wait()

  const deployedAddressEvent = receipt.events?.find((event: { event: string }) => event.event === "deployedAddress")
  const contractAddress = deployedAddressEvent?.args[0]
  const ownerAddress = deployedAddressEvent?.args[1]

  console.log(contractAddress)
  // 0x34d0E48cFaECAA7fB0fe77D0bEc029451CA521B8
  const gitAddress = contractAddress

  console.log("---------- Git Contract ----------")
  const gitABI = loadContract("quorum", "Git", "core").abi
  const gitContract = new ethers.Contract(gitAddress, gitABI.abi, wallet)

  console.log("factory", await gitContract.factory())
  console.log("owner", await gitContract.codeOwner())
  console.log("commitHash", await gitContract.getLatestPack())

  // generate a commit hash for test
  // await gitContract.createRequest(1, [], [], "test")
  // call contract to get git repo (another signer)

  // call git contract address to commit push merge

  // create bounty , get bounty, close bounty
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
