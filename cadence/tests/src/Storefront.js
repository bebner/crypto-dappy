import {
  getAccountAddress,
  mintFlow,
  deployContractByName,
  sendTransaction,
  executeScript
} from "flow-js-testing"
import * as dappyContract from "./DappyContract";


export const deployNonFungibleToken = async () => {
  const DappyAdmin = await dappyContract.getDappyAdminAddress()
  const addressMap = { FungibleToken: "0xee82856bf20e2aa6" }
  await deployContractByName({ to: DappyAdmin, name: "NonFungibleToken", addressMap })
}

export const deployNFTStorefront = async () => {
  const DappyAdmin = await dappyContract.getDappyAdminAddress()
  const addressMap = { 
    FungibleToken: "0xee82856bf20e2aa6",
    NonFungibleToken: DappyAdmin
  }
  await deployContractByName({ to: DappyAdmin, name: "NFTStorefront", addressMap })
}

export const deployDappyNFT = async () => {
  const DappyAdmin = await dappyContract.getDappyAdminAddress()
  const addressMap = { 
    FungibleToken: "0xee82856bf20e2aa6",
    NonFungibleToken: DappyAdmin,
    DappyContract: DappyAdmin
  }
  await deployContractByName({ to: DappyAdmin, name: "DappyNFT", addressMap })
}
export const createDappyNFTCollection = async(recipient) => {
  const name = "CreateDappyNFTCollection"
  const signers = [recipient]
  await sendTransaction({ name, signers })
}

export const createNFTStorefront = async(recipient) => {
  const name = "CreateNFTStorefront"
  const signers = [recipient]
  await sendTransaction({ name, signers })
}

export const putDappyInStorefront = async (recipient, dappyID, saleCuts) => {
  const name = "PutDappyInStorefront"
  const signers = [recipient]
  const args = [dappyID, saleCuts]
  await sendTransaction({ name, signers, args })
}

export const listStorefrontListings = async (recipient) => {
  const name = "ListStorefrontListings"
  const args = [recipient]
  const listings = await executeScript({ name, args })
  return listings
}