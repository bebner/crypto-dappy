import GalleryContract from "../contracts/GalleryContract.cdc"
import NFTStorefront from "../contracts/NFTStorefront.cdc"

transaction(adminAddress: Address, listingResourceID: UInt64) {
  
  let listingPublic: &{NFTStorefront.ListingPublic}
  let galleryRef: &{GalleryContract.GalleryPublic}
  let sellerAddress: Address

  prepare (acct: AuthAccount)
  {
    
    let adminAccount = getAccount(adminAddress)
    self.sellerAddress = acct.address

    self.galleryRef = adminAccount
      .getCapability<&{GalleryContract.GalleryPublic}>(
        GalleryContract.GalleryPublicPath)
      .borrow()
        ?? panic("Could not borrow Gallery ref")

    let storefrontRef = acct
      .getCapability<&{NFTStorefront.StorefrontPublic}>(
        NFTStorefront.StorefrontPublicPath
      )
      .borrow()
        ?? panic ("Could not borrow Storefront ref")

    self.listingPublic = storefrontRef.borrowListing(listingResourceID: listingResourceID) 
        ?? panic ("Could not borrow Listing ref")
  }

  execute {
    self.galleryRef.addListing(
      listingPublic: self.listingPublic,
      sellerAddress: self.sellerAddress
    )
  }

}