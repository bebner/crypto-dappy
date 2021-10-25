export const LIST_GALLERY_COLLECTION = `
import GalleryContract from  0xGalleryContract

pub fun main(galleryAddress: Address):  {UInt64: GalleryContract.GalleryData} {

  let account = getAccount(galleryAddress)

  let galleryRef = account
    .getCapability<&{GalleryContract.GalleryPublic}>(
      GalleryContract.GalleryPublicPath  
    )
    .borrow()
    ?? panic ("Could not borrow Gallery ref")

  let galleryCollection = galleryRef.getGalleryCollection()

  return galleryCollection
}

`