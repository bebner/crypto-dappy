import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import DappyNFT from "../contracts/DappyNFT.cdc"

transaction {
  prepare(acct: AuthAccount) {
    
    let collection <- DappyNFT.createEmptyCollection()
    acct.save<@DappyNFT.Collection>(<-collection, to: DappyNFT.CollectionStoragePath)

    acct.link<&{NonFungibleToken.CollectionPublic}>(DappyNFT.CollectionPublicPath, target: DappyNFT.CollectionStoragePath) 

    acct.link<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(DappyNFT.CollectionPrivatePath, target: DappyNFT.CollectionStoragePath) 

  }
}