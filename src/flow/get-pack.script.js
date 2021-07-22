export const GET_PACK = `
  import DappyContract from 0xDappy

  pub fun main(familyID: UInt32): DappyContract.FamilyReport {
    let family = DappyContract.getFamily(familyID: familyID)
    return family
  }
`
