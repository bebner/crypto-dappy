export const CREATE_COLLECTION = `
  import DappyContract from 0xDappy
  import NonFungibleToken from 0xNonFungibleToken
  import DappyNFT from 0xMyDappyNFT
  import PackNFT from 0xPackNFT
  import NFTStorefront from 0xNFTStorefront  

  transaction {
    prepare(acct: AuthAccount) {

      let collection <- DappyContract.createEmptyCollection()
      acct.save<@DappyContract.Collection>(<-collection, to: DappyContract.CollectionStoragePath)
      acct.link<&{DappyContract.CollectionPublic}>(DappyContract.CollectionPublicPath, target: DappyContract.CollectionStoragePath)

      // DappyNFT Collection

      let dappyCollection <- DappyNFT.createEmptyCollection()
      acct.save<@DappyNFT.Collection>(<-dappyCollection, to: DappyNFT.CollectionStoragePath)
  
      acct.link<&{NonFungibleToken.CollectionPublic}>(DappyNFT.CollectionPublicPath, target: DappyNFT.CollectionStoragePath) 
  
      acct.link<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(DappyNFT.CollectionPrivatePath, target: DappyNFT.CollectionStoragePath) 

      // PackNFT Collection

      let packCollection <- PackNFT.createEmptyCollection()
      acct.save<@PackNFT.Collection>(<-packCollection, to: PackNFT.CollectionStoragePath)
  
      acct.link<&{NonFungibleToken.CollectionPublic}>(PackNFT.CollectionPublicPath, target: PackNFT.CollectionStoragePath) 
  
      acct.link<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(PackNFT.CollectionPrivatePath, target: PackNFT.CollectionStoragePath)
      
      // NFTStorefront

      let storefront <- NFTStorefront.createStorefront()

      acct.save<@NFTStorefront.Storefront>(<- storefront, to: NFTStorefront.StorefrontStoragePath)
  
      acct.link<&{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath) 

    }
  }
`