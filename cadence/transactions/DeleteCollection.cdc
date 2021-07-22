import DappyContract from "../contracts/DappyContract.cdc"

transaction() {
  prepare(acct: AuthAccount) {
    let collectionRef <- acct.load<@DappyContract.Collection>(from: DappyContract.CollectionStoragePath)
      ?? panic("Could not borrow collection reference")
    destroy collectionRef
    acct.unlink(DappyContract.CollectionPublicPath)

   
  }
}