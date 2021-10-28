export const DELETE_NFT_COLLECTION = `
  import DappyNFT from 0xMyDappyNFT
  import NFTStorefront from 0xNFTStorefront

  transaction() {
    prepare(acct: AuthAccount) {
         
      let collectionRef <- acct.load<@DappyNFT.Collection>(from: DappyNFT.CollectionStoragePath)
    ?? panic("Could not borrow collection reference")

      destroy collectionRef

      acct.unlink(DappyNFT.CollectionPublicPath) 

      acct.unlink(DappyNFT.CollectionPrivatePath)

      let storefront <- acct.load<@NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)

      destroy storefront
  
      acct.unlink(NFTStorefront.StorefrontPublicPath) 
 
    }
  }
`