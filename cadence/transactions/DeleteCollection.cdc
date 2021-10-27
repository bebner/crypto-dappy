import DappyContract from "../contracts/DappyContract.cdc"
import DappyNFT from "../contracts/DappyNFT.cdc"
import PackNFT from "../contracts/PackNFT.cdc"
import NFTStorefront from "../contracts/NFTStorefront.cdc"


  transaction() {
    prepare(acct: AuthAccount) {

      let collectionRef <- acct.load<@AnyResource>(from: DappyContract.CollectionStoragePath)
      destroy collectionRef
      acct.unlink(DappyContract.CollectionPublicPath)
      
      // DappyNFT

      let dappyCollectionRef <- acct.load<@DappyNFT.Collection>(from: DappyNFT.CollectionStoragePath)
      destroy dappyCollectionRef
      acct.unlink(DappyNFT.CollectionPublicPath) 
      acct.unlink(DappyNFT.CollectionPrivatePath)

      // PackNFT

      let packCollectionRef <- acct.load<@PackNFT.Collection>(from: PackNFT.CollectionStoragePath)
      destroy packCollectionRef
      acct.unlink(PackNFT.CollectionPublicPath) 
      acct.unlink(PackNFT.CollectionPrivatePath)

      // Storefront

      let storefront <- acct.load<@NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
      destroy storefront
      acct.unlink(NFTStorefront.StorefrontPublicPath) 
  
    }
  }