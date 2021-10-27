export const PURCHASE_PACK_STOREFRONT =`
import DappyContract from 0xDappy
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import FUSD from 0xFUSD
import PackNFT from 0xPackNFT
import NFTStorefront from 0xNFTStorefront
import GalleryContract from 0xGalleryContract

transaction(adminAddress: Address, listingResourceID:UInt64, sellerAddress: Address) {
  // signed by buyer

  let storefrontRef: &{NFTStorefront.StorefrontPublic}
  let receiverRef: &{DappyContract.CollectionPublic}
  let vaultRef: &FungibleToken.Vault
  let listingRef: &NFTStorefront.Listing{NFTStorefront.ListingPublic}

  let galleryRef: &{GalleryContract.GalleryPublic}
  
  
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

    // Admin ref to storefront
    let adminAccount = getAccount(adminAddress)
    self.galleryRef = adminAccount
      .getCapability<&{GalleryContract.GalleryPublic}>(
        GalleryContract.GalleryPublicPath)
      .borrow()
        ?? panic("Could not borrow Gallery ref")

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
    
    // Storefront cleanup
    self.galleryRef.removeListing(
      listingResourceID: listingResourceID, 
      sellerAddress: sellerAddress)

  }
}
`