import { query } from "@onflow/fcl";
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

export const deployGalleryContract = async () => {
  const DappyAdmin = await dappyContract.getDappyAdminAddress()
  const addressMap = { 
    DappyContract: DappyAdmin,
    NFTStorefront: DappyAdmin
  }
  await deployContractByName({ to: DappyAdmin, name: "GalleryContract", addressMap })
}

export const createAdminGallery = async(admin) => {
  const DappyAdmin = await dappyContract.getDappyAdminAddress()
  const name = "CreateAdminGallery"
  const addressMap = { 
    GalleryContract: DappyAdmin,
  }
  const signers = [admin]
  await sendTransaction({ name, signers, addressMap })
}

export const putDappyInStorefront = async (recipient, dappyID, salePrice) => {
  const DappyAdmin = await dappyContract.getDappyAdminAddress()
  const name = "PutDappyInStorefront"
  const signers = [recipient]
  const args = [dappyID, salePrice, DappyAdmin]
  await sendTransaction({ name, signers, args })
}

export const listStorefrontListings = async (recipient) => {
  const name = "ListStorefrontListings"
  const args = [recipient]
  const dappyID = await executeScript({ name, args })
  return dappyID
}

export const listGalleryCollection = async () => {
  const DappyAdmin = await dappyContract.getDappyAdminAddress()
  const name = "ListGalleryCollection"
  const args = [DappyAdmin]
  const dappyID = await executeScript({ name, args })
  return dappyID
}