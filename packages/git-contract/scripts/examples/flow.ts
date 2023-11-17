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
  const commitHash = ethers.utils.arrayify("0xec551900e483bf0d9a67c17dd14a6d59a7c9095c")
  const gitInit = await gitFactory.getRepoAddress(
    commitHash,
    "testCID",
  )
  const receipt = await gitInit.wait()
  console.log(receipt)

  const deployedAddressEvent = receipt.events?.find((event: { event: string }) => event.event === "deployedAddress")
  const contractAddress = deployedAddressEvent?.args[0]
  const ownerAddress = deployedAddressEvent?.args[1]

  console.log("Contract Address:", contractAddress)
  console.log("Owner Address:", ownerAddress)

  console.log("---------- Git Contract ----------")
  const gitABI = loadContract("quorum", "Git", "core").abi
  const gitContract = new ethers.Contract(contractAddress, gitABI.abi, wallet)
  // create contract
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
