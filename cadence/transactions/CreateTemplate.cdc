import DappyContract from "../contracts/DappyContract.cdc"

transaction(dna: String, name: String) {

  var adminRef: &DappyContract.Admin

  prepare(acct: AuthAccount) {
    self.adminRef = acct.borrow<&DappyContract.Admin>(from: DappyContract.AdminStoragePath) ?? panic("Cannot borrow admin ref")
  }

  execute {
    self.adminRef.createTemplate(dna: dna, name: name)
  }
}
 