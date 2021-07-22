import DappyContract from "../contracts/DappyContract.cdc"

pub fun main(familyID: UInt32): [UInt32] {
  let templates = DappyContract.listFamilyTemplates(familyID: familyID)
  return templates
}