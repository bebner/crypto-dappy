import FungibleToken from "../contracts/FungibleToken.cdc"
import FUSD from "../contracts/FUSD.cdc"

transaction (to: Address, amount: UFix64) {
  let sentVault: @FungibleToken.Vault

  prepare(signer: AuthAccount) {
    let minterRef = signer.borrow<&FUSD.Minter>(from: /storage/fusdMinter) ?? panic("Cannot borrow reference")
    self.sentVault <- minterRef.mintTokens(amount: amount)
  }

  execute {
    let recipient = getAccount(to)
    let receiverRef = recipient.getCapability(/public/fusdReceiver).borrow<&{FungibleToken.Receiver}>()
            ?? panic("Could not borrow receiver reference to the recipient's Vault")

    // Deposit the withdrawn tokens in the recipient's receiver
    receiverRef.deposit(from: <-self.sentVault)
  }
}