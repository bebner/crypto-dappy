import NFTStorefront from "../contracts/NFTStorefront.cdc"
transaction() {
  prepare(acct: AuthAccount) {
   
    let collectionRef <- acct.load<@NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)

    destroy collectionRef

    acct.unlink(NFTStorefront.StorefrontPublicPath) 
   
  }
}