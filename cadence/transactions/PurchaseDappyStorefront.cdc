import DappyContract from "../contracts/DappyContract.cdc"
import FUSD from "../contracts/FUSD.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"
import DappyNFT from "../contracts/DappyNFT.cdc"
import NFTStorefront from "../contracts/NFTStorefront.cdc"

transaction(listingResourceID:UInt64, sellerAddress: Address) {
  // signed by buyer

  let storefrontRef: &{NFTStorefront.StorefrontPublic}
  let receiverRef: &{DappyContract.CollectionPublic}
  let vaultRef: &FungibleToken.Vault
  let listingRef: &NFTStorefront.Listing{NFTStorefront.ListingPublic}
  
  prepare(acct: AuthAccount) { 

    // Seller
    let sellerAccount = getAccount(sellerAddress)
    self.storefrontRef = sellerAccount
      .getCapability<&{NFTStorefront.StorefrontPublic}>(
        NFTStorefront.StorefrontPublicPath)
      .borrow()
        ?? panic ("Could not borrow Storefront ref")

    self.listingRef = self.storefrontRef.borrowListing(listingResourceID: listingResourceID)
        ?? panic ("Could not borrow Listing ref")

    // Buyer 
    self.receiverRef = acct
      .getCapability<&{DappyContract.CollectionPublic}>(
        DappyContract.CollectionPublicPath)
      .borrow()
        ?? panic ("Could not borrow Dappy Collection ref")

    self.vaultRef = acct
      .borrow<&FungibleToken.Vault>(
        from: /storage/fusdVault)
        ?? panic ("Could not borrow FUSD Vault ref")

  }

  execute {
    
    let amount = self.listingRef.getDetails().salePrice
    let vault <- self.vaultRef.withdraw(amount: amount)
    let nft <- self.listingRef.purchase(payment: <- vault) as! @DappyNFT.NFT
    let dappy <- nft.withdrawDappy()
      ?? panic("cannot withdraw Dappy from provider")
    self.receiverRef.deposit(token: <- dappy)
    destroy nft

  }
}
 
    // log("dappy.id")
    // log(dappy.id)
    // log("*************************")