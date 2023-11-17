import fs from "fs"
import { task } from "hardhat/config"

task("verify:contract", "Verify deployed contract")
  .addParam("file")
  .addParam("contract")
  .setAction(async ({ file, contract }, hre) => {
    try {
      const contractAddress = fs.readFileSync(`scripts/address/${hre.network.name}/mainContract.json`)
      const addressData = JSON.parse(contractAddress.toString())
      await hre.run("verify:verify", {
        address: addressData.main,
        constructorArguments: [],
        contract: `contracts/${file}.sol:${contract}`,
      })
    } catch (e) {
      console.log(e)
    }
  },
  )

task("verify:create2", "Verify deployed contract from create2")
  .addParam("contract", "Contract by create2 factory (Default: null)", "null")
  .setAction(async ({ contract }, hre) => {
    try {
      const contractAddress = fs.readFileSync(`scripts/address/${hre.network.name}/create2Contract.json`)
      const addressData = JSON.parse(contractAddress.toString())

      await hre.run("verify:verify", {
        address: addressData.factory,
        constructorArguments: [],
        contract: "contracts/Create2Factory.sol:Create2Factory",
      })

      if (addressData.addressFromSalt) {
        await hre.run("verify:verify", {
          address: addressData.addressFromSalt,
          constructorArguments: ["implAddress"],
          contract: `contracts/${contract}.sol:${contract}`,
        })
      }
    } catch (e) {
      console.log(e)
    }
  },
  )

task("verify:proxy", "Verify deployed proxy contract and link implementation contract")
  .addOptionalParam("impl", "Implementation Contract File (Default: TestTokenUpgradeable)", "TestTokenUpgradeable")
  .setAction(async (taskArgs, hre) => {
    try {
      if (!fs.existsSync(`scripts/address/${hre.network.name}/proxyContract.json`)) {
        console.log("Not detected proxyContract json, need to deploy proxy and implementation contract first")
        return
      }
      const proxyData = fs.readFileSync(`scripts/address/${hre.network.name}/proxyContract.json`)
      const addressData = JSON.parse(proxyData.toString())

      // Verify Implementation Contract
      await hre.run("verify:verify", {
        address: addressData.proxy,
        constructorArguments: [],
        contract: `contracts/${taskArgs.impl}.sol:${addressData.impl}`,
      })
    } catch (e) {
      console.log(e)
    }
  },
  )

task("verify:proxyFromCreate2", "Verify deployed proxy contract by Create2 or manual")
  .addOptionalParam("proxy", "Proxy Contract (Default: UUPSProxy)", "UUPSProxy")
  .addOptionalParam("impl", "Implementation Contract File (Default: TestTokenUpgradeable)", "TestTokenUpgradeable")
  .setAction(async (taskArgs, hre) => {
    try {
      if (!fs.existsSync(`scripts/address/${hre.network.name}/proxyContract.json`)) {
        console.log("Not detected proxyContract json, need to deploy proxy and implementation contract first")
        return
      }
      const proxyData = fs.readFileSync(`scripts/address/${hre.network.name}/proxyContract.json`)
      const addressData = JSON.parse(proxyData.toString())

      // Verify Implementation Contract
      await hre.run("verify:verify", {
        address: addressData.implAddr,
        constructorArguments: [],
        contract: `contracts/${taskArgs.impl}.sol:${addressData.impl}`,
      })

      // Verify Proxy Contract
      await hre.run("verify:verify", {
        address: addressData.proxy,
        constructorArguments: [addressData.implAddr, "0x8129fc1c"],
        contract: `contracts/${taskArgs.proxy}.sol:${taskArgs.proxy}`,
      })
    } catch (e) {
      console.log(e)
    }
  },
  )

task("verify:gitContract", "Verify deployed git contract")
  .addParam("address")
  .setAction(async ({ address }, hre) => {
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
        contract: "contracts/core/Git.sol:Git",
      })
    } catch (e) {
      console.log(e)
    }
  },
  )
