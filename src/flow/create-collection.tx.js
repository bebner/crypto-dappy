export const CREATE_COLLECTION = `
  import DappyContract from 0xDappy
  
  transaction {
    prepare(acct: AuthAccount) {
      let collection <- DappyContract.createEmptyCollection()
      acct.save<@DappyContract.Collection>(<-collection, to: DappyContract.CollectionStoragePath)
      acct.link<&{DappyContract.CollectionPublic}>(DappyContract.CollectionPublicPath, target: DappyContract.CollectionStoragePath)
    }
  }
`