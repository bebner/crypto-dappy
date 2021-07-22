import { useEffect, useReducer } from 'react'
import { defaultReducer } from '../reducer/defaultReducer'
import { useUser } from '../providers/UserProvider'

import { Pack } from '../utils/PackClass'
import { DEFAULT_PACKS } from '../config/packs.config'

export default function useDappyPacks() {
  const [state, dispatch] = useReducer(defaultReducer, {
    loading: true,
    error: false,
    data: []
  })
  const { collection, batchAddDappies } = useUser()

  useEffect(() => {
    const fetchPacks = async () => {
      dispatch({ type: 'PROCESSING' })
      try {
        const res = DEFAULT_PACKS
        dispatch({ type: 'SUCCESS', payload: res })
      } catch (err) {
        dispatch({ type: 'ERROR' })
      }
    }
    fetchPacks()
  }, [])

  const fetchPackDetails = async (packID) => {
    let res = DEFAULT_PACKS.find(p => p.familyID === packID)
    return new Pack(res?.familyID, res?.name, res?.price)
  }

  const fetchDappiesOfPack = async (packID) => {
    let res = DEFAULT_PACKS.find(p => p.familyID === packID)?.templates
    return res
  }

  const mintFromPack = async (packID, dappies, amount) => {
    if (!collection) {
      alert(`
      You need to enable the collection first. 
      Go to the tab 'Collection' and click on 'Create Collection'.`)
      return
    }

    var dappiesToMint = []

    for (let index = 0; index < dappies.length; index++) {
      if (index > 4) break
      const randomNumber = Math.floor(Math.random() * dappies.length);
      dappiesToMint.push(dappies[randomNumber])
    }

    batchAddDappies(dappiesToMint)
  }


  return {
    ...state,
    fetchDappiesOfPack,
    fetchPackDetails,
    mintFromPack,
  }
}
