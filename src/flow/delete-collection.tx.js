export const DELETE_COLLECTION = `
  import DappyContract from 0xDappy

  transaction() {
    prepare(acct: AuthAccount) {
      let collectionRef <- acct.load<@DappyContract.Collection>(from: DappyContract.CollectionStoragePath)
        ?? panic("Could not borrow collection reference")
      destroy collectionRef
      acct.unlink(DappyContract.CollectionPublicPath)
    }
  }
`