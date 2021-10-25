export const REMOVE_GALLERY_LISTING=`
import GalleryContract from 0xGalleryContract
import NFTStorefront from 0xNFTStorefront

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
`