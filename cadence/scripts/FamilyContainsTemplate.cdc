import DappyContract from "../contracts/DappyContract.cdc"

pub fun main (familyID: UInt32, templateID: UInt32): Bool {
  return DappyContract.familyContainsTemplate(familyID: familyID, templateID: templateID)
}