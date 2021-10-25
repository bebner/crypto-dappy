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

export const deployPackNFT = async () => {
  const DappyAdmin = await dappyContract.getDappyAdminAddress()
  const addressMap = { 
    FungibleToken: "0xee82856bf20e2aa6",
    NonFungibleToken: DappyAdmin,
    DappyContract: DappyAdmin
  }
  await deployContractByName({ to: DappyAdmin, name: "PackNFT", addressMap })
}

export const createDappyNFTCollection = async(recipient) => {
  const name = "CreateDappyNFTCollection"
  const signers = [recipient]
  await sendTransaction({ name, signers })
}

export const createPackNFTCollection = async(recipient) => {
  const name = "CreatePackNFTCollection"
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
    NFTStorefront: DappyAdmin,
    DappyNFT: DappyAdmin,
    PackNFT: DappyAdmin,
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

export const putPackInStorefront = async (recipient, dappyIDs, salePrice) => {
  const DappyAdmin = await dappyContract.getDappyAdminAddress()
  const name = "PutPackInStorefront"
  const signers = [recipient]
  const args = [dappyIDs, salePrice, DappyAdmin]
  await sendTransaction({ name, signers, args })
}

export const listStorefrontListings = async (recipient) => {
  const name = "ListStorefrontListings"
  const args = [recipient]
  const allListingDetails = await executeScript({ name, args })
  return allListingDetails
}

export const listGalleryCollection = async () => {
  const DappyAdmin = await dappyContract.getDappyAdminAddress()
  const name = "ListGalleryCollection"
  const args = [DappyAdmin]
  const gallery = await executeScript({ name, args })
  return gallery
}

export const purchaseDappyStorefront = async (buyerAddress, listingResourceID, sellerAddress) => {
  const name = "PurchaseDappyStorefront"
  const signers = [buyerAddress]
  const args = [listingResourceID, sellerAddress]
  await sendTransaction({ name, signers, args })
}

export const purchasePackStorefront = async (buyerAddress, listingResourceID, sellerAddress) => {
  const name = "PurchasePackStorefront"
  const signers = [buyerAddress]
  const args = [listingResourceID, sellerAddress]
  await sendTransaction({ name, signers, args })
}

export const cleanupStorefront = async (listingResourceID, sellerAddress) => {
  const buyer = await getAccountAddress("DappyBuyer")
  const name = "CleanUpStorefront"
  const signers = [buyer]
  const args = [listingResourceID, sellerAddress]
  await sendTransaction({ name, signers, args })
}

export const addGalleryListing = async (listingResourceID, recipient) => {
  const DappyAdmin = await dappyContract.getDappyAdminAddress()
  const name = "AddGalleryListing"
  const signers = [recipient]
  const args = [DappyAdmin, listingResourceID]
  await sendTransaction({ name, signers, args })
}

export const removeGalleryListing = async (galleryID, recipient) => {
  const DappyAdmin = await dappyContract.getDappyAdminAddress()
  const name = "RemoveGalleryListing"
  const signers = [recipient]
  const args = [DappyAdmin, galleryID]
  await sendTransaction({ name, signers, args })  
}
