import { task } from "hardhat/config"
import { writeFileSync } from "../helpers/pathHelper"

task("deploy:file", "Deploy git")
  .addFlag("verify", "Validate contract after deploy")
  .setAction(async ({ verify }, hre) => {
    await hre.run("compile")
    const [signer]: any = await hre.ethers.getSigners()
    const feeData = await hre.ethers.provider.getFeeData()
    const contractFactory = await hre.ethers.getContractFactory("contracts/DealClient.sol:DealClient")
    const deployContract: any = await contractFactory.connect(signer).deploy()
    console.log(`DealClient.sol deployed to ${deployContract.address}`)

    const address = {
      main: deployContract.address,
    }
    const addressData = JSON.stringify(address)
    writeFileSync(`scripts/address/${hre.network.name}/`, "DealClient.json", addressData)

    await deployContract.deployed()

    if (verify) {
      console.log("verifying contract...")
      await deployContract.deployTransaction.wait(1)
      try {
        await hre.run("verify:verify", {
          address: deployContract.address,
          constructorArguments: [],
          contract: "contracts/DealClient.sol:DealClient",
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  )
