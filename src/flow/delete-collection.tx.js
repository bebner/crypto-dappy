export const DELETE_COLLECTION = `
  import DappyContract from 0xDappy
  import DappyNFT from 0xMyDappyNFT
  import PackNFT from 0xPackNFT
  import NFTStorefront from 0xNFTStorefront


  transaction() {
    prepare(acct: AuthAccount) {

      let collectionRef <- acct.load<@DappyContract.Collection>(from: DappyContract.CollectionStoragePath)
        ?? panic("Could not borrow collection reference")
      destroy collectionRef
      acct.unlink(DappyContract.CollectionPublicPath)

      // DappyNFT

      let dappyCollectionRef <- acct.load<@DappyNFT.Collection>(from: DappyNFT.CollectionStoragePath)
      ?? panic("Could not borrow DappyNFT collection reference")
  
      destroy dappyCollectionRef

      acct.unlink(DappyNFT.CollectionPublicPath) 

      acct.unlink(DappyNFT.CollectionPrivatePath)

      // PackNFT

      let packCollectionRef <- acct.load<@PackNFT.Collection>(from: PackNFT.CollectionStoragePath)
      ?? panic("Could not borrow PackNFT collection reference")
  
      destroy packCollectionRef

      acct.unlink(PackNFT.CollectionPublicPath) 

      acct.unlink(PackNFT.CollectionPrivatePath)

      // Storefront

      let storefront <- acct.load<@NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)

      destroy storefront
  
      acct.unlink(NFTStorefront.StorefrontPublicPath) 
  
    }
  }
`