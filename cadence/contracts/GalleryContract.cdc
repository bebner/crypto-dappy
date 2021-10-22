import DappyContract from "./DappyContract.cdc"
import NFTStorefront from "./NFTStorefront.cdc"

pub contract GalleryContract {

  pub let GalleryStoragePath: StoragePath
  pub let GalleryPublicPath: PublicPath

  pub event GalleryListingAdded(
      storefrontResourceID: UInt64,
      sellerAddress: Address
  )

  pub event GalleryListingRemoved(
      storefrontResourceID: UInt64,
      sellerAddress: Address
  )  

  pub struct GalleryData {
    
    pub let listingDetails: NFTStorefront.ListingDetails
    pub let sellerAddress: Address

    init (
      listingDetails: NFTStorefront.ListingDetails,
      sellerAddress: Address
    ) {

      self.listingDetails = listingDetails
      self.sellerAddress = sellerAddress

    }

  }

  pub resource interface GalleryPublic {

    pub fun addListing (
      listingPublic: &NFTStorefront.Listing{NFTStorefront.ListingPublic},
      sellerAddress: Address
    )

    pub fun removeListing (
      storefrontResourceID: UInt64,
      sellerAddress: Address
    )

    pub fun getGalleryCollection (): {UInt64: GalleryData}

  }
  
  pub resource Gallery: GalleryPublic {
    
    access(contract) let galleryCollection: {UInt64: GalleryData}

    init() {
      self.galleryCollection = {}
    }

    pub fun getGalleryCollection (): {UInt64: GalleryData} {
      return self.galleryCollection
    }
    
    // Add a listing to gallery
    pub fun addListing (
      listingPublic: &NFTStorefront.Listing{NFTStorefront.ListingPublic},
      sellerAddress: Address
    ) {
      
      pre {
        // 1. naively check if the address hold this listing
      }

      let details = listingPublic.getDetails()
      let galleryData = GalleryData(
        listingDetails: details,
        sellerAddress: sellerAddress)

      self.galleryCollection[details.storefrontID] = galleryData
      
      emit GalleryListingAdded(
        storefrontResourceID: details.storefrontID,
        sellerAddress: sellerAddress
      )

    }

    // Add a listing to gallery
    pub fun removeListing (
      storefrontResourceID: UInt64,
      sellerAddress: Address
    ) {
      
      pre {
        // 1. naively check if the address hold this listing no more
      }

      self.galleryCollection.remove(key: storefrontResourceID)
      
      emit GalleryListingRemoved(
        storefrontResourceID: storefrontResourceID,
        sellerAddress: sellerAddress
      )

    }
    
  }

  pub fun createEmptyGallery(): @Gallery {
    return <- create Gallery()
  }

  init() {
    self.GalleryStoragePath = /storage/DappyGallery
    self.GalleryPublicPath = /public/DappyGallery
  }

}