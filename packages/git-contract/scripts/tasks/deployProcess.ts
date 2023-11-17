import { task } from "hardhat/config"
import { writeFileSync } from "../helpers/pathHelper"

task("deploy:contract", "Deploy contract")
  .addParam("contract")
  .setAction(async ({ contract }, hre) => {
    await hre.run("compile")
    const [signer]: any = await hre.ethers.getSigners()
    const contractFactory = await hre.ethers.getContractFactory(contract)
    // if you mint in constructor, you need to add value in deploy function
    const deployContract: any = await contractFactory.connect(signer).deploy()
    console.log(`TestToken.sol deployed to ${deployContract.address}`)

    const address = {
      main: deployContract.address,
    }
    const addressData = JSON.stringify(address)
    writeFileSync(`scripts/address/${hre.network.name}/`, "mainContract.json", addressData)

    await deployContract.deployed()
  },
  )

task("deploy:git", "Deploy git")
  .addFlag("verify", "Validate contract after deploy")
  .setAction(async ({ verify }, hre) => {
    await hre.run("compile")
    const [signer]: any = await hre.ethers.getSigners()

    const feeData = await hre.ethers.provider.getFeeData()
    const contractFactory = await hre.ethers.getContractFactory("contracts/core/Git.sol:Git")
    const deployContract: any = await contractFactory.connect(signer).deploy({
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      maxFeePerGas: feeData.maxFeePerGas,
      gasLimit: 4000000,
    })
    console.log(`Git.sol deployed to ${deployContract.address}`)

    const address = {
      main: deployContract.address,
    }
    const addressData = JSON.stringify(address)
    writeFileSync(`scripts/address/${hre.network.name}/`, "Git.json", addressData)

    await deployContract.deployed()

    if (verify) {
      console.log("verifying contract...")
      await deployContract.deployTransaction.wait(1)
      try {
        await hre.run("verify:verify", {
          address: deployContract.address,
          constructorArguments: [],
          contract: "contracts/core/Git.sol:Git",
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  )

task("deploy:gitfactory", "Deploy git factory")
  .addFlag("verify", "Validate contract after deploy")
  .setAction(async ({ verify }, hre) => {
    await hre.run("compile")
    const [signer]: any = await hre.ethers.getSigners()
    const feeData = await hre.ethers.provider.getFeeData()

    const contractFactory = await hre.ethers.getContractFactory("contracts/GitFactory.sol:GitFactory")
    const deployContract: any = await contractFactory.connect(signer).deploy({
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      maxFeePerGas: feeData.maxFeePerGas,
      gasLimit: 4000000,
    })
    console.log(`GitFactory.sol deployed to ${deployContract.address}`)

    const address = {
      main: deployContract.address,
    }
    const addressData = JSON.stringify(address)
    writeFileSync(`scripts/address/${hre.network.name}/`, "GitFactory.json", addressData)

    await deployContract.deployed()

    if (verify) {
      console.log("verifying contract...")
      await deployContract.deployTransaction.wait(1)
      try {
        await hre.run("verify:verify", {
          address: deployContract.address,
          constructorArguments: [],
          contract: "contracts/GitFactory.sol:GitFactory",
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  )
