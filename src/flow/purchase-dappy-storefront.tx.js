export const PURCHASE_DAPPY_STOREFRONT = `
import DappyContract from 0xDappy
import FUSD from 0xFUSD
import NonFungibleToken from 0xNonFungibleToken
import FungibleToken from 0xFungibleToken
import DappyNFT from 0xMyDappyNFT
import NFTStorefront from 0xNFTStorefront

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
 
`