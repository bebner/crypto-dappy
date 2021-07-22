import path from "path"
import {
  emulator,
  init,
  executeScript,
  getAccountAddress,
  mintFlow
} from "flow-js-testing"
import {
  deployDappyContract,
  mintDappy,
  createDappyCollection,
  listUserDappies,
  createDappyTemplate,
  createDappyFamily,
  addTemplateToFamily,
  listTemplatesOfFamily,
  batchMintDappyFromFamily
} from "./src/DappyContract";
import { fundAccountWithFUSD } from "./src/FUSD";

jest.setTimeout(50000);

const TEST_DAPPY = {
  templateID: 1,
  dna: "FF5A9D.FFE922.60C5E5.0",
  name: "Panda Dappy",
  price: "7.00000000"
}

const TEST_FAMILY = {
  name: "Pride Dappies",
  price: "30.00000000",
  familyID: 1
}

describe("CryptoDappy", () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../");
    const port = 8080;
    init(basePath, port);
    return emulator.start(port, false);
  });

  afterEach(async () => {
    return emulator.stop();
  });

  it("deploys CryptoDappy contract", async () => {
    await deployDappyContract()
  });

  it("should list 0 dappies", async () => {
    await deployDappyContract()
    const res = await executeScript({ name: "ListTemplates" })
    expect(res).toMatchObject({})
  });

  it("Admin should create new templates", async () => {
    await deployDappyContract()
    await createDappyTemplate(TEST_DAPPY)
    const res = await executeScript({ name: "ListTemplates" })
    expect(res['1']).toMatchObject(TEST_DAPPY)
  });

  it("Should mint FUSD", async () => {
    const recipient = await getAccountAddress("DappyRecipient")
    const balance = await fundAccountWithFUSD(recipient, "100.00")
    expect(balance).toBe("100.00000000")
  })

  it("Should mint a dappy", async () => {
    await deployDappyContract()
    await createDappyTemplate(TEST_DAPPY)
    const recipient = await getAccountAddress("DappyRecipient")
    await mintFlow(recipient, "10.0")
    await fundAccountWithFUSD(recipient, "100.00")
    await createDappyCollection(recipient)
    await mintDappy(recipient, TEST_DAPPY)
    const userDappies = await listUserDappies(recipient)
    expect(userDappies['1']).toMatchObject(TEST_DAPPY)
  })

  it("Should add a template to a family", async () => {
    await deployDappyContract()
    await createDappyTemplate(TEST_DAPPY)
    await createDappyFamily(TEST_FAMILY)
    await addTemplateToFamily(TEST_FAMILY, TEST_DAPPY)
    const templates = await listTemplatesOfFamily(TEST_FAMILY.familyID)
    expect(templates).toEqual(expect.arrayContaining([1]))
  })

  it("Should mint a dappy pack", async () => {
    await deployDappyContract()
    await createDappyTemplate(TEST_DAPPY)
    await createDappyFamily(TEST_FAMILY)
    await addTemplateToFamily(TEST_FAMILY, TEST_DAPPY)
    const recipient = await getAccountAddress("DappyRecipient")
    await mintFlow(recipient, "10.0")
    await fundAccountWithFUSD(recipient, "100.00")
    await createDappyCollection(recipient)
    const templateIDs = Array(3).fill(TEST_DAPPY.templateID)
    await batchMintDappyFromFamily(TEST_FAMILY.familyID, templateIDs, TEST_FAMILY.price, recipient)
    const userDappies = await listUserDappies(recipient)
    expect(Object.keys(userDappies)).toHaveLength(templateIDs.length)
  })
})