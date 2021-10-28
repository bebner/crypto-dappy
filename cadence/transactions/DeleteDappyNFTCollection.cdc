import DappyContract from "../contracts/DappyContract.cdc"
import DappyNFT from "../contracts/DappyNFT.cdc"
transaction() {
  prepare(acct: AuthAccount) {
   
    let collectionRef <- acct.load<@DappyNFT.Collection>(from: DappyNFT.CollectionStoragePath)
      ?? panic("Could not borrow collection reference")

    destroy collectionRef

    acct.unlink(DappyNFT.CollectionPublicPath) 

    acct.unlink(DappyNFT.CollectionPrivatePath)
   
  }
}