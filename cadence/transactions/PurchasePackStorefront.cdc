import DappyContract from "../contracts/DappyContract.cdc"
import FUSD from "../contracts/FUSD.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"
import PackNFT from "../contracts/PackNFT.cdc"
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

    assert (
      self.listingRef.getDetails().nftType == Type<@PackNFT.NFT>(),
      message: "Purchase wrong NFT type"
    )


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
    let nft <- self.listingRef.purchase(payment: <- vault) as! @PackNFT.NFT
    let dappies <- nft.withdrawDappies()
    for key in dappies.keys {
      let x <- dappies[key] <- nil
      self.receiverRef.deposit(token: <- x!)
    }
    destroy dappies
    destroy nft

  }
}
