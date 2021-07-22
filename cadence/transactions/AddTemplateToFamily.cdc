import DappyContract from "../contracts/DappyContract.cdc"

transaction(familyID: UInt32, templateID: UInt32) {

  var adminRef: &DappyContract.Admin

  prepare(acct: AuthAccount) {
    self.adminRef = acct.borrow<&DappyContract.Admin>(from: /storage/DappyAdmin) ?? panic("Cannot borrow admin ref")
  }

  execute {
    let familyRef = self.adminRef.borrowFamily(familyID: familyID)
    familyRef.addTemplate(templateID: templateID)
  }
}