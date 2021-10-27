import DappyContract from "../contracts/DappyContract.cdc"
import DappyNFT from "../contracts/DappyNFT.cdc"
import PackNFT from "../contracts/PackNFT.cdc"
import NFTStorefront from "../contracts/NFTStorefront.cdc"

pub contract GalleryContract {

  pub let GalleryStoragePath: StoragePath
  pub let GalleryPublicPath: PublicPath

  pub event GalleryListingAdded(
      listingResourceID: UInt64,
      sellerAddress: Address
  )

  pub event GalleryListingRemoved(
      listingResourceID: UInt64,
      sellerAddress: Address
  )

  pub struct GalleryData {
    
    pub let listingDetails: NFTStorefront.ListingDetails
    pub let sellerAddress: Address
    pub let dappyCollection: {UInt64: DappyContract.Template}
    pub let packName: String


    init (
      listingDetails: NFTStorefront.ListingDetails,
      sellerAddress: Address,
      dappyCollection: {UInt64: DappyContract.Template},
      packName: String
    ) {
      pre {
        
        dappyCollection.length > 0 :
          "Gallery data should include some Dappy data"
        
        dappyCollection.length > 1 || packName.length == 0 :
          "Individual Dappy should not have any pack name"
        
        dappyCollection.length == 1 || packName.length > 0 :
          "Pack should have some name"

        dappyCollection.length == 1 || packName.length >= 3 :
          "Pack name should be at least 3 characters"

      }

      self.listingDetails = listingDetails
      self.sellerAddress = sellerAddress
      self.dappyCollection = dappyCollection
      self.packName = packName
      
    }
    
  }

  pub resource interface GalleryPublic {

    pub fun addListing (
      listingPublic: &{NFTStorefront.ListingPublic},
      sellerAddress: Address
    )

    pub fun removeListing (
      listingResourceID: UInt64,
      sellerAddress: Address
    ) : GalleryData?

    pub fun getGalleryCollection (): {UInt64: GalleryData}

  }
  
  pub resource Gallery: GalleryPublic {
    
    priv let galleryCollection: {UInt64: GalleryData}

    init() {
      self.galleryCollection = {}
    }

    pub fun getGalleryCollection (): {UInt64: GalleryData} {      
      return self.galleryCollection
    }
    
    // Add a listing to gallery
    pub fun addListing (
      listingPublic: &{NFTStorefront.ListingPublic},
      sellerAddress: Address
    ) {
      
      pre {
        // 1. naively check if the address hold this listing
      }

      let details = listingPublic.getDetails()
      let nftType = details.nftType
      let nftID = details.nftID
      var dappyCollection: {UInt64: DappyContract.Template} = {}

      // TODO: Check
      let listingResourceID = listingPublic.getListingResourceID()

      var packName = ""

      switch nftType {

        case Type<@DappyNFT.NFT>():
          let nftRef = listingPublic.borrowNFT() as! &DappyNFT.NFT
          dappyCollection = nftRef.getData()

        case Type<@PackNFT.NFT>():
          let nftRef = listingPublic.borrowNFT() as! &PackNFT.NFT
          dappyCollection = nftRef.getData()
          packName = dappyCollection.keys.length.toString().concat("-Pack")

        default:
          panic("nftType is not supported: ".concat(nftType.identifier) )
           
      }

      let galleryData = GalleryData(
        listingDetails: details,
        sellerAddress: sellerAddress,
        dappyCollection: dappyCollection,
        packName: packName
      )

      self.galleryCollection[listingResourceID] = galleryData

    }

    // Add a listing to gallery
    pub fun removeListing (
      listingResourceID: UInt64,
      sellerAddress: Address
    ): GalleryData? {
      
      pre {
        // 1. naively check if the address hold this listing no more
      }

      let ret = self.galleryCollection.remove(key: listingResourceID)
      
      return ret

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
