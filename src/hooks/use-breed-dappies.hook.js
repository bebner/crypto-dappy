import { useReducer } from 'react'
import { mutate, tx } from '@onflow/fcl'

import { useTxs } from '../providers/TxProvider'
import { BREED_DAPPIES } from '../flow/breed-dappies.tx'
const BREED_MAX_CAP = 2

export default function useBreedDappies() {
  
  const { addTx, runningTxs } = useTxs()  

  const reducer = (state, action) => {
    switch (action.type) {
      case 'ADD':
        //skip if dappy exists or total dappies is 2
        if (state.data.length >= BREED_MAX_CAP) return { ...state }
        for (const d of state.data) {
          if (d.serialNumber === action.payload.serialNumber) return { ...state }
        }
        return {
          ...state,
          data: [...state.data, action.payload]
        }
      case 'RESET':
        return {
          ...state,
          data: []
        }
      default:
        throw new Error("Error in useUserPack reducer")
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    data: []
  })
  
  const addMate = ({ dappy }) => {
    dispatch({ type: 'ADD', payload: dappy })
  }
  
  const breedDappies = async ( dappies) => {
   
    if (dappies.length !== BREED_MAX_CAP ) 
    {
      // TODO: replace with proper error reporting
      alert("Need both male and female to breed")
      return
    }

    if (runningTxs) {
      alert("Transactions are still running. Please wait for them to finish first.")
      return
    }

    const maleID = parseInt(dappies[0].serialNumber)
    const femaleID = parseInt(dappies[1].serialNumber)
    // console.log(dappies)
    // console.log(maleID, femaleID)
    try {
      let res = await mutate({
        cadence: BREED_DAPPIES,
        limit: 6000,
        args: (arg, t) => [
          arg(maleID, t.UInt64), 
          arg(femaleID, t.UInt64)
        ]
      })
      addTx(res)
      await tx(res).onceSealed()    

    dispatch({ type: 'RESET' })


    } catch (error) {
      console.error(error, error.stack)
    }
    
  }

  return {
    ...state,
    addMate,
    breedDappies
  }
}
