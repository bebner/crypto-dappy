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
import { fundAccountWithFUSD, createFUSDVault, mintFUSD } from "./src/FUSD";

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

  it.only("Should list 1 dappy for sale", async () => {
    let DappyAdmin = await dappyContract.getDappyAdminAddress()
    mintFlow(DappyAdmin, "10.0")
    await storefront.deployNonFungibleToken()
    await storefront.deployNFTStorefront()
    await dappyContract.deployDappyContract()
    await dappyContract.createDappyTemplate(TEST_DAPPY)
    const recipient = await getAccountAddress("DappyRecipient")
    await mintFlow(recipient, "10.0")
    await fundAccountWithFUSD(recipient, "100.00")
    await createFUSDVault(DappyAdmin)
    await mintFUSD(DappyAdmin, "100.00")
    await dappyContract.createDappyCollection(recipient)
    await dappyContract.mintDappy(recipient, TEST_DAPPY)
    await storefront.deployDappyNFT()
    await storefront.createDappyNFTCollection(recipient)
    await storefront.createNFTStorefront(recipient)

    const saleCuts = {
      [DappyAdmin]: "1.0",
      [recipient]: "8.0"
    }

    await storefront.putDappyInStorefront(recipient, 1, saleCuts) // list dappy with id=1 for sale
    
    // emulator.setLogging(true)
    const userListings = await storefront.listStorefrontListings(recipient)

    console.log(userListings)
    
  }); 

  
})
