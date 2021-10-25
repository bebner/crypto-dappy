import GalleryContract from "../contracts/GalleryContract.cdc"

transaction {
  prepare(acct: AuthAccount) {

    let oldGallery <- acct.load<@AnyResource>(from: GalleryContract.GalleryStoragePath)
    
    destroy oldGallery
  
    acct.unlink(GalleryContract.GalleryPublicPath)   

    let gallery <- GalleryContract.createEmptyGallery()  
    
    acct.save(<-gallery, to: GalleryContract.GalleryStoragePath)

    acct.link<&{GalleryContract.GalleryPublic}>(GalleryContract.GalleryPublicPath, target: GalleryContract.GalleryStoragePath)

  }
}