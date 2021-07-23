export const DELETE_COLLECTION = `
  import DappyContract from 0xDappy

  transaction {
    prepare(acct: AuthAccount) {
      let collection <- acct.load<@DappyContract.Collection>(from: DappyContract.CollectionStoragePath)
              ?? panic("Could not load resource") 
      destroy collection
      acct.unlink(DappyContract.CollectionPublicPath)
    }
  }
`;
