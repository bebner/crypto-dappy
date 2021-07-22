export const LIST_DAPPIES_IN_PACK = `
  import DappyContract from 0xDappy

  pub fun main(familyID: UInt32): [UInt32] {
    let templates = DappyContract.listFamilyTemplates(familyID: familyID)
    return templates
  }
`