import { mutate, query, tx, config } from '@onflow/fcl'
import { useEffect, useReducer } from 'react'

import { LIST_DAPPIES_IN_PACK } from '../flow/list-dappies-in-pack.script'
import { MINT_DAPPIES_FROM_PACK } from '../flow/mint-dappies-from-pack.tx'
import { LIST_PACKS } from '../flow/list-packs.scripts'
import { LIST_GALLERY_COLLECTION } from '../flow/list-gallery-collection.script'
import { GET_PACK } from '../flow/get-pack.script'
import { defaultReducer } from '../reducer/defaultReducer'
import { useUser } from '../providers/UserProvider'
import { useTxs } from '../providers/TxProvider'
import { Pack } from '../utils/PackClass'

export default function useDappyPacks() {
  const [state, dispatch] = useReducer(defaultReducer, {
    loading: true,
    error: false,
    data: []
  })
  const { collection, batchAddDappies, getFUSDBalance } = useUser()
  const { runningTxs, addTx } = useTxs()

  useEffect(() => {

    const getGalleryPacks = async () => {
      try {

        const galleryPacks =  []

        const adminAddress = await config().get("0xGalleryContract")
        let galleryCollection = await query({
          cadence: LIST_GALLERY_COLLECTION,
          args: (arg, t) => [arg(adminAddress, t.Address)]
        })

        for (const [listingResourceID, galleryData] of Object.entries(galleryCollection)) {
          // Make sure that type is PackNFT
          if (
            Object.keys(galleryData.dappyCollection).length > 1
            && galleryData.listingDetails.nftType.endsWith("PackNFT.NFT")
          ) {

            const pack = {
              name: galleryData.packName,
              familyID: listingResourceID,
              price: galleryData.listingDetails.salePrice,
              templates: Object.values(galleryData.dappyCollection),
              sellerAddress: galleryData.sellerAddress
            }

            galleryPacks.push(pack)

          }
        }

        return galleryPacks

      } catch (err) {
        console.error(err, err.stack)
        dispatch({ type: 'ERROR' })
      }

    }
    
    const fetchPacks = async () => {
      dispatch({ type: 'PROCESSING' })

      let galleryPacks = await getGalleryPacks()

      try {
        const res = await query({
          cadence: LIST_PACKS
        })
        dispatch({ type: 'SUCCESS', payload: galleryPacks.concat(res) })
      } catch (err) {
        console.error(err, err.stack)
        dispatch({ type: 'ERROR' })
      }

    }

    fetchPacks()

  }, [])

  const fetchPackDetails = async (packID) => {
    let res = await query({
      cadence: GET_PACK,
      args: (arg, t) => [arg(packID, t.UInt32)]
    })
    return new Pack(res?.familyID, res?.name, res?.price)
  }

  const fetchDappiesOfPack = async (packID) => {
    let res = await query({
      cadence: LIST_DAPPIES_IN_PACK,
      args: (arg, t) => [arg(packID, t.UInt32)]
    })
    return res
  }

  const mintFromPack = async (packID, dappies, amount) => {
    if (!collection) {
      alert(`
      You need to enable the collection first. 
      Go to the tab 'Collection' and click on 'Create Collection'.`)
      return
    }

    if (runningTxs) {
      alert("Transactions are still running. Please wait for them to finish first.")
      return
    }

    var dappiesToMint = []

    for (let index = 0; index < dappies.length; index++) {
      if (index > 4) break
      const randomNumber = Math.floor(Math.random() * dappies.length);
      dappiesToMint.push(dappies[randomNumber])
    }

    let packNum = parseInt(packID.replace("Pack", ""))
    let res = await mutate({
      cadence: MINT_DAPPIES_FROM_PACK,
      limit: 300,
      args: (arg, t) => [arg(packNum, t.UInt32), arg(dappiesToMint, t.Array(t.UInt32)), arg(amount, t.UFix64)]

    })
    addTx(res)
    await tx(res).onceSealed()
    await getFUSDBalance()
    batchAddDappies(dappiesToMint)
  }


  return {
    ...state,
    fetchDappiesOfPack,
    fetchPackDetails,
    mintFromPack,
  }
}
