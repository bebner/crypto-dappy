import GalleryContract from "../contracts/GalleryContract.cdc"

transaction {
  prepare(acct: AuthAccount) {

    let gallery <- GalleryContract.createEmptyGallery()  
    
    acct.save(<-gallery, to: GalleryContract.GalleryStoragePath)

    acct.link<&{GalleryContract.GalleryPublic}>(GalleryContract.GalleryPublicPath, target: GalleryContract.GalleryStoragePath)

  }
}