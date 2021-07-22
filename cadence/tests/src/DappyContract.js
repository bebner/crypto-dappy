import {
  getAccountAddress,
  mintFlow,
  deployContractByName,
  sendTransaction,
  executeScript
} from "flow-js-testing"

export const getDappyAdminAddress = async () => getAccountAddress("DappyAdmin")

export const deployDappyContract = async () => {
  const DappyAdmin = await getAccountAddress("DappyAdmin")
  await mintFlow(DappyAdmin, "10.0")
  const addressMap = { FungibleToken: "0xee82856bf20e2aa6" }
  await deployContractByName({ to: DappyAdmin, name: "DappyContract", addressMap })
}

export const createDappyTemplate = async (dappy) => {
  const DappyAdmin = await getDappyAdminAddress()
  const signers = [DappyAdmin]
  const name = "CreateTemplate"
  const args = [dappy.dna, dappy.name]
  await sendTransaction({ name, signers, args })
}

export const createDappyCollection = async (recipient) => {
  const name = "CreateCollection"
  const signers = [recipient]
  await sendTransaction({ name, signers })
}

export const mintDappy = async (recipient, dappy) => {
  const name = "MintDappy"
  const signers = [recipient]
  const args = [dappy.templateID, dappy.price]
  await sendTransaction({ name, args, signers })
}

export const listUserDappies = async (recipient) => {
  const name = "ListUserDappies"
  const args = [recipient]
  const dappies = await executeScript({ name, args })
  return dappies
}

export const createDappyFamily = async (family) => {
  const DappyAdmin = await getDappyAdminAddress()
  const name = "CreateFamily"
  const signers = [DappyAdmin]
  const args = [family.name, family.price]
  await sendTransaction({ name, signers, args })
}

export const addTemplateToFamily = async (family, template) => {
  const DappyAdmin = await getDappyAdminAddress()
  const name = "AddTemplateToFamily"
  const signers = [DappyAdmin]
  const args = [family.familyID, template.templateID]
  await sendTransaction({ name, signers, args })
}

export const listTemplatesOfFamily = async (familyID) => {
  const name = "ListFamilyTemplates"
  const args = [familyID]
  const res = await executeScript({ name, args })
  return res;
}

export const batchMintDappyFromFamily = async (familyID, templateIDs, amount, recipient) => {
  const name = "BatchMintDappyFromFamily"
  const signers = [recipient]
  const args = [familyID, templateIDs, amount]
  await sendTransaction({ name, signers, args })
}

