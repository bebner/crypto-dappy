import DappyContract from "../contracts/DappyContract.cdc"
import FUSD from "../contracts/FUSD.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"
import DappyNFT from "../contracts/DappyNFT.cdc"
import NFTStorefront from "../contracts/NFTStorefront.cdc"

transaction(listingResourceID:UInt64, sellerAddress: Address) {
  // signed by buyer

  let storefrontRef: &{NFTStorefront.StorefrontPublic}
  
  prepare(acct: AuthAccount) { 

    // Seller
    let sellerAccount = getAccount(sellerAddress)
    self.storefrontRef = sellerAccount
      .getCapability<&{NFTStorefront.StorefrontPublic}>(
        NFTStorefront.StorefrontPublicPath)
      .borrow()
        ?? panic ("Could not borrow Storefront ref")

  }

  execute {
    
    self.storefrontRef.cleanup(listingResourceID: listingResourceID)

  }
}
 