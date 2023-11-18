// import { ethers } from "ethers"
// import CID from "cids"

// export const dealClient = async (taskArgs: any, network: any) => {
//   const cid = taskArgs.pieceCid // The address of the DealRewarder contract
//   const cidHexRaw = new CID(cid).toString("base16").substring(1)
//   const cidHex = `0x${cidHexRaw}`
//   const contractAddr = taskArgs.contract

//   const verified = (taskArgs.verifiedDeal === "true")
//   const skipIpniAnnounce = (taskArgs.skipIpniAnnounce === "true")
//   const removeUnsealedCopy = (taskArgs.removeUnsealedCopy === "true")

//   const extraParamsV1 = [
//     taskArgs.locationRef,
//     taskArgs.carSize,
//     skipIpniAnnounce,
//     removeUnsealedCopy,
//   ]

//   const DealRequestStruct = [
//     cidHex,
//     taskArgs.pieceSize,
//     verified,
//     taskArgs.label,
//     taskArgs.startEpoch,
//     taskArgs.endEpoch,
//     taskArgs.storagePricePerEpoch,
//     taskArgs.providerCollateral,
//     taskArgs.clientCollateral,
//     taskArgs.extraParamsVersion,
//     extraParamsV1,
//   ]
//   const networkId = network.name
//   console.log("Making deal proposal on network", networkId)

//   // create a new wallet instance
//   const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)

//   // create a DealClient contract factory
//   const DealClient = await ethers.getContractFactory("DealClient", wallet)
//   // create a DealClient contract instance
//   // this is what you will call to interact with the deployed contract
//   const dealClient = await DealClient.attach(contractAddr)

//   // send a transaction to call makeDealProposal() method
//   const transaction = await dealClient.makeDealProposal(DealRequestStruct)
//   const transactionReceipt = await transaction.wait()

//   // listen for DealProposalCreate event
//   const event = transactionReceipt.events[0].topics[0]
//   console.log("Complete! Event Emitted. ProposalId is:", event)
// }
