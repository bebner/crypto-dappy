import DappyContract from "../contracts/DappyContract.cdc"
import FUSD from "../contracts/FUSD.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"


transaction(templateID: UInt32, amount: UFix64) {
  let receiverReference: &DappyContract.Collection{DappyContract.Receiver}
  let sentVault: @FungibleToken.Vault

  prepare(acct: AuthAccount) {
    self.receiverReference = acct.borrow<&DappyContract.Collection>(from: DappyContract.CollectionStoragePath) 
        ?? panic("Cannot borrow")
    let vaultRef = acct.borrow<&FUSD.Vault>(from: /storage/fusdVault) ?? panic("Could not borrow FUSD vault")
    self.sentVault <- vaultRef.withdraw(amount: amount)
  }

  execute {
    let newDappy <- DappyContract.mintDappy(templateID: templateID, paymentVault: <-self.sentVault)
    self.receiverReference.deposit(token: <-newDappy)
  }
}