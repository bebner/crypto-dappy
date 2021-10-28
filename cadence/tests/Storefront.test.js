import path from "path"
import {
  emulator,
  init,
  executeScript,
  getAccountAddress,
  mintFlow
} from "flow-js-testing"
import * as storefront from "./src/Storefront";
import * as dappyContract from "./src/DappyContract";
import { fundAccountWithFUSD, createFUSDVault, mintFUSD, getFUSDBalance } from "./src/FUSD";

jest.setTimeout(50000);

const TEST_DAPPY = {
  templateID: 1,
  dna: "FF5A9D.FFE922.60C5E5.0",
  name: "Panda Dappy",
  price: "7.00000000"
}

const TEST_FAMILY = {
  name: "Pride Dappies",
  price: "30.00000000",
  familyID: 1
}

describe("NFTStorefront", () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../");
    const port = 8080;
    init(basePath, port);
    return emulator.start(port, false);
  });

  afterEach(async () => {
    return emulator.stop();
  });

  it("deploys Storefront contract", async () => {
    let DappyAdmin = await dappyContract.getDappyAdminAddress()
    mintFlow(DappyAdmin, "10.0")
    await storefront.deployNonFungibleToken()
    await storefront.deployNFTStorefront()
  });

  it("deploys DappyNFT contract", async () => {
    let DappyAdmin = await dappyContract.getDappyAdminAddress()
    await mintFlow(DappyAdmin, "10.0")
    await storefront.deployNonFungibleToken()
    await dappyContract.deployDappyContract()
    await storefront.deployDappyNFT()
  });

  it("Should create 1 DappyNFT collection", async () => {
    const recipient = await getAccountAddress("DappyRecipient")
    await mintFlow(recipient, "10.0")
    let DappyAdmin = await dappyContract.getDappyAdminAddress()
    await mintFlow(DappyAdmin, "10.0")
    await storefront.deployNonFungibleToken()
    await dappyContract.deployDappyContract()
    await storefront.deployDappyNFT()
    await storefront.createDappyNFTCollection(recipient)
  });

  it("creates Admin Gallery", async () => {
    let DappyAdmin = await dappyContract.getDappyAdminAddress()
    await mintFlow(DappyAdmin, "10.0")
    await storefront.deployNonFungibleToken()
    await dappyContract.deployDappyContract()
    await storefront.deployDappyNFT()
    await storefront.deployPackNFT()
    await storefront.deployNFTStorefront()
    await storefront.deployGalleryContract()
    await storefront.createAdminGallery(DappyAdmin)
  });

  it("Should list 1 dappy for sale", async () => {
    let DappyAdmin = await dappyContract.getDappyAdminAddress()
    mintFlow(DappyAdmin, "10.0")
    await storefront.deployNonFungibleToken()
    await dappyContract.deployDappyContract()
    await storefront.deployDappyNFT()
    await storefront.deployPackNFT()
    await storefront.deployNFTStorefront()
    await storefront.deployGalleryContract()

    await dappyContract.createDappyTemplate(TEST_DAPPY)
    const recipient = await getAccountAddress("DappyRecipient")
    await mintFlow(recipient, "10.0")
    await fundAccountWithFUSD(recipient, "100.00")
    await createFUSDVault(DappyAdmin)
    await mintFUSD(DappyAdmin, "100.00")
    await dappyContract.createDappyCollection(recipient)
    await dappyContract.mintDappy(recipient, TEST_DAPPY)
    await storefront.createDappyNFTCollection(recipient)
    await storefront.createNFTStorefront(recipient)

    const saleCuts = {
      [DappyAdmin]: "1.0",
      [recipient]: "8.0"
    }

    const salePrice = "11.0"

    await storefront.createAdminGallery(DappyAdmin)
    await storefront.putDappyInStorefront(recipient, 1, salePrice) // list dappy with id=1 for sale
        
    const allListingDetails = await storefront.listStorefrontListings(recipient)    
    const dappyID = Object.values(allListingDetails)[0].nftID
    expect(dappyID).toBe(1)
    const listingResourceID = parseInt(Object.keys(allListingDetails)[0])    
    
    await storefront.addGalleryListing(listingResourceID, recipient)
    
    const gallery = await storefront.listGalleryCollection()
    
    const nftID = Object.values(gallery)[0].listingDetails.nftID
    const dappyCollection = Object.values(gallery)[0].dappyCollection
    const sellerAddress = Object.values(gallery)[0].sellerAddress
    const galleryID = parseInt(Object.keys(gallery)[0])
    expect(nftID).toBe(1)
    expect(sellerAddress).toBe(recipient)
    expect(parseInt(Object.keys(dappyCollection)[0])).toBe(nftID)
    expect(galleryID).toBe(listingResourceID)
    
    // emulator.setLogging(true)
    // console.log(allListingDetails)
    // console.log(gallery)
    // console.log(dappyCollection)
  }); 


  it("Should purchase 1 dappy", async () => {
    let DappyAdmin = await dappyContract.getDappyAdminAddress()
    mintFlow(DappyAdmin, "10.0")
    await storefront.deployNonFungibleToken()
    await dappyContract.deployDappyContract()
    await storefront.deployDappyNFT()
    await storefront.deployPackNFT()
    await storefront.deployNFTStorefront()
    await storefront.deployGalleryContract()

    await dappyContract.createDappyTemplate(TEST_DAPPY)
    const recipient = await getAccountAddress("DappyRecipient")
    await mintFlow(recipient, "10.0")
    await fundAccountWithFUSD(recipient, "100.00")
    await createFUSDVault(DappyAdmin)
    await mintFUSD(DappyAdmin, "100.00")
    await dappyContract.createDappyCollection(recipient)
    await dappyContract.mintDappy(recipient, TEST_DAPPY)
    await storefront.createDappyNFTCollection(recipient)
    await storefront.createNFTStorefront(recipient)

    const salePrice = "11.0"
    await storefront.createAdminGallery(DappyAdmin)
    await storefront.putDappyInStorefront(recipient, 1, salePrice) // list dappy with id=1 for sale
    let allListingDetails = await storefront.listStorefrontListings(recipient)    
    const dappyID = Object.values(allListingDetails)[0].nftID
    expect(dappyID).toBe(1)
    const listingResourceID = parseInt(Object.keys(allListingDetails)[0])   
    await storefront.addGalleryListing(listingResourceID, recipient)
    let gallery = await storefront.listGalleryCollection()

    const galleryID = parseInt(Object.keys(gallery)[0])
    expect(galleryID).toBe(listingResourceID)
        
    const buyer = await getAccountAddress("DappyBuyer")
    await mintFlow(buyer, "10.0")
    await createFUSDVault(buyer)
    await mintFUSD(buyer, "100.00")
    await dappyContract.createDappyCollection(buyer)

    await storefront.purchaseDappyStorefront(buyer, galleryID,  recipient)

    await storefront.removeGalleryListing(galleryID,  recipient)    

    gallery = await storefront.listGalleryCollection()
    allListingDetails = await storefront.listStorefrontListings(recipient)
    expect(Object.keys(gallery).length).toBe(0)    
    expect(Object.keys(allListingDetails).length).toBe(1)   
    expect(Object.values(allListingDetails)[0].purchased).toBe(true)
    
    await storefront.cleanupStorefront(listingResourceID, recipient)
    allListingDetails = await storefront.listStorefrontListings(recipient)
    
    expect(Object.keys(allListingDetails).length).toBe(0)   
    
    // emulator.setLogging(true)
  }); 

  it("Should purchase 1 pack of 3 dappies", async () => {
    let DappyAdmin = await dappyContract.getDappyAdminAddress()
    mintFlow(DappyAdmin, "10.0")
    await storefront.deployNonFungibleToken()
    await dappyContract.deployDappyContract()
    await storefront.deployDappyNFT()
    await storefront.deployPackNFT()
    await storefront.deployNFTStorefront()
    await storefront.deployGalleryContract()

    await dappyContract.createDappyTemplate(TEST_DAPPY)
    await dappyContract.createDappyFamily(TEST_FAMILY)
    await dappyContract.addTemplateToFamily(TEST_FAMILY, TEST_DAPPY)

    const recipient = await getAccountAddress("DappyRecipient")
    await mintFlow(recipient, "10.0")
    await fundAccountWithFUSD(recipient, "100.00")
    await createFUSDVault(DappyAdmin)
    await mintFUSD(DappyAdmin, "100.00")

    await dappyContract.createDappyCollection(recipient)
    const templateIDs = Array(3).fill(TEST_DAPPY.templateID)
    await dappyContract.batchMintDappyFromFamily(TEST_FAMILY.familyID, templateIDs, TEST_FAMILY.price, recipient)
    const userDappies = await dappyContract.listUserDappies(recipient)
    expect(Object.keys(userDappies)).toHaveLength(templateIDs.length)
    // console.log(userDappies)
    let dappyIDs = Object.keys(userDappies).map( (value) => parseInt(value))

    await storefront.createPackNFTCollection(recipient)
    await storefront.createNFTStorefront(recipient)

    const salePrice = "110.0"
    await storefront.createAdminGallery(DappyAdmin)
    await storefront.putPackInStorefront(recipient, dappyIDs, salePrice)

    let allListingDetails = await storefront.listStorefrontListings(recipient)    
    const packID = Object.values(allListingDetails)[0].nftID
    expect(packID).toBe(1)

    const listingResourceID = parseInt(Object.keys(allListingDetails)[0])   
    await storefront.addGalleryListing(listingResourceID, recipient)
    let gallery = await storefront.listGalleryCollection()

    const galleryID = parseInt(Object.keys(gallery)[0])
    expect(galleryID).toBe(listingResourceID)
       
    const buyer = await getAccountAddress("DappyBuyer")
    await mintFlow(buyer, "10.0")
    await createFUSDVault(buyer)
    let beforeBalance = 200.00
    await mintFUSD(buyer, beforeBalance.toFixed(8) )
    await dappyContract.createDappyCollection(buyer)

    await storefront.purchasePackStorefront(buyer, galleryID,  recipient)
    
    const dappyReceived = await dappyContract.listUserDappies(buyer)
    expect(Object.keys(dappyReceived).length).toBe(3)
    expect(dappyReceived['3']).toEqual(TEST_DAPPY)

    await storefront.removeGalleryListing(galleryID,  recipient)
    
    gallery = await storefront.listGalleryCollection()
    allListingDetails = await storefront.listStorefrontListings(recipient)
    expect(Object.keys(gallery).length).toBe(0)    
    expect(Object.keys(allListingDetails).length).toBe(1)   
    expect(Object.values(allListingDetails)[0].purchased).toBe(true)
    
    await storefront.cleanupStorefront(listingResourceID, recipient)
    allListingDetails = await storefront.listStorefrontListings(recipient)
    
    expect(Object.keys(allListingDetails).length).toBe(0)   
    let afterBalance = parseFloat(await getFUSDBalance(buyer))

    expect(afterBalance).toBe( beforeBalance - salePrice)

    // emulator.setLogging(true)
  }); 
  
})
 