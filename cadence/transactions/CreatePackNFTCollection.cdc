import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import PackNFT from "../contracts/PackNFT.cdc"

transaction {
  prepare(acct: AuthAccount) {
    
    let collection <- PackNFT.createEmptyCollection()
    acct.save<@PackNFT.Collection>(<-collection, to: PackNFT.CollectionStoragePath)

    acct.link<&{NonFungibleToken.CollectionPublic}>(PackNFT.CollectionPublicPath, target: PackNFT.CollectionStoragePath) 

    acct.link<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(PackNFT.CollectionPrivatePath, target: PackNFT.CollectionStoragePath) 

  }
}