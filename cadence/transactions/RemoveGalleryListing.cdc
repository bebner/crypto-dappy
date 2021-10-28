import GalleryContract from "../contracts/GalleryContract.cdc"
import NFTStorefront from "../contracts/NFTStorefront.cdc"

transaction (adminAddress: Address, listingResourceID: UInt64) {

  let galleryRef: &{GalleryContract.GalleryPublic}
  let sellerAddress: Address

  prepare (acct: AuthAccount){

    let account = getAccount(adminAddress)
    self.sellerAddress = acct.address

    self.galleryRef = account
      .getCapability<&{GalleryContract.GalleryPublic}>(
        GalleryContract.GalleryPublicPath)
      .borrow()
        ?? panic("Could not borrow Gallery ref")
    
  }

  execute { 

    self.galleryRef.removeListing(
      listingResourceID: listingResourceID, 
      sellerAddress: self.sellerAddress)

  }
  
}