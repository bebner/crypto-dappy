import { useEffect, useReducer } from 'react'
import { query, config } from '@onflow/fcl'

import { LIST_GALLERY_COLLECTION } from '../flow/list-gallery-collection.script'
import { LIST_DAPPY_TEMPLATES } from '../flow/list-dappy-templates.script'
import { defaultReducer } from '../reducer/defaultReducer'
import DappyClass from '../utils/DappyClass'

export default function useDappyTemplates() {
  const [state, dispatch] = useReducer(defaultReducer, { loading: false, error: false, data: [] })

  useEffect(() => {
    const fetchDappyTemplates = async () => {
      dispatch({ type: 'PROCESSING' })
      try {

        let galleryDappies = []

        const adminAddress = await config().get("0xGalleryContract")
        let galleryCollection = await query({
          cadence: LIST_GALLERY_COLLECTION,
          args: (arg, t) => [arg(adminAddress, t.Address)]
        })

        for (const [listingResourceID, galleryData] of Object.entries(galleryCollection)) {
          // Make sure that type is DappyNFT
          if (
            Object.keys(galleryData.dappyCollection).length === 1
            && galleryData.listingDetails.nftType.endsWith("DappyNFT.NFT")
          ) {

            const [key, dappyData] = Object.entries(galleryData.dappyCollection)[0]
            dappyData.serialNumber = parseInt(key)
            let dappy = new DappyClass(
              dappyData.templateID,
              dappyData.dna,
              dappyData.name,
              galleryData.listingDetails.salePrice,
              dappyData.serialNumber
            )
            dappy.sellerAddress = galleryData.sellerAddress
            dappy.listingResourceID = parseInt(listingResourceID)

            galleryDappies.push(dappy)
          }

        }

        let res = await query({ cadence: LIST_DAPPY_TEMPLATES })

        let mappedDappies = Object.values(res).map(d => {
          return new DappyClass(d?.templateID, d?.dna, d?.name, d?.price)
        })

        dispatch({ type: 'SUCCESS', payload: galleryDappies.concat(mappedDappies) })
      } catch (err) {
        console.error(err, err.stack)
        dispatch({ type: 'ERROR' })
      }
    }
    fetchDappyTemplates()
  }, [])

  return state
}
