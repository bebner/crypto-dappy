import FUSD from "../contracts/FUSD.cdc"
import DappyContract from "../contracts/DappyContract.cdc"

// This transaction should be signed by DappyContract owner account
transaction()  {
  
  prepare (acct: AuthAccount) { 

    // create col
    let admin = acct.borrow<&DappyContract.Admin>(from: DappyContract.AdminStoragePath) ?? panic("Admin")
    
    for id in DappyContract.listTemplates().keys {
      admin.destroyTemplate(dappyID: id)
    }  

    admin.createTemplate(  dna: "FF5A9D.FFE922.60C5E5.0", name: "Panda Dappy")
    admin.createTemplate(  dna: "94DFF6.F6ABBA.94DFF6.1", name: "Tranzi Dappy")
    admin.createTemplate(  dna: "74ee15.cae36f.6b6b49.7fc48f.0", name: "Queen Dappy")
    admin.createTemplate(  dna: "D61774.9D5098.1F429C.1", name: "Bibi Dappy")
    admin.createTemplate(  dna: "FF5A9D.FFAA47.FFE922.B6E927.60C5E5.7320D3", name: "Queery Dappy")
    admin.createTemplate(  dna: "F8EF38.8D5FA8.211F20.2", name: "Nobi Dappy")
    admin.createTemplate(  dna: "55fb59.b931ed.be7e39.519494.3", name: "Adonis Dappy")
    admin.createTemplate(  dna: "F571A4.972E90.18469E.211F20", name: "Fludi Dappy")
    admin.createTemplate(  dna: "BF1E6C.DA4A97.EA5CA3.FBE1E4.E84B56.4", name: "Lesli Dappy")
    admin.createTemplate(  dna: "A3A5A4.8D5FA8.211F20.2", name: "Asel Dappy")
    admin.createTemplate(  dna: "A3A5A4.BCDA84.211F20.2", name: "Agent Dappy")
    admin.createTemplate(  dna: "001DED.E84B56.211F20.2", name: "Polly Dappy")
    admin.createTemplate(  dna: "D50E8D.5BBD70.068DCF.0", name: "Poldi Dappy")
    admin.createTemplate(  dna: "df1f4f.ac069b.25443c.1922ff.1", name: "Lucienne Dappy")
    admin.createTemplate(  dna: "ad634b.798f9d.6c2af1.19a9f7.3", name: "Mohammad Dappy")

    log(DappyContract.listTemplates())

  }

}
