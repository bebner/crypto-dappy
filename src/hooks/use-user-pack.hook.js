import {  useReducer } from 'react'
import { mutate, tx } from '@onflow/fcl'

import { useTxs } from '../providers/TxProvider'

import { PUT_DAPPY_STOREFRONT } from '../flow/put-dappy-storefront.tx'

export default function useUserPack() {

  const { addTx, runningTxs } = useTxs()

  const reducer = (state, action)  => {
    switch (action.type) {
      case 'ADD':
        //skip if dappy exists or total dappies is 4
        console.log(state.data)
        if (state.data.length >= 4) return { ...state }
        for (const d of state.data ) {
          if (d.id === action.payload.id) return { ...state}
        }
        const price = parseFloat(action.payload.price)
        return {
          ...state,
          data: [...state.data, action.payload],
          price: state.price + price
        }
      case 'NEW':
        return {
          ...state,
          data: [...state.data, action.payload],
          price: parseFloat(action.payload.price)
        }  
      case 'REMOVE':
        return {
          ...state,
          data: [...state.data, action.payload]
        }  
      default:
        throw new Error("Error in useUserPack reducer")
    }
  }

  const [state, dispatch] = useReducer( reducer, {
    data:[],
    price: 0.0
  })

  const addToPack = ({dappy}) => {
    dispatch({ type: 'ADD', payload: dappy})
  }

  const removeFromPack = async ({dappy}) => {
  }

  const listDappyForSale = async (dappy, wantPrice) => {

    const dappyID = dappy.serialNumber

    const salePrice = parseFloat(wantPrice).toFixed(8)

    if (runningTxs) {
      alert("Transactions are still running. Please wait for them to finish first.")
      return
    }

    try {
      let res = await mutate({
        cadence: PUT_DAPPY_STOREFRONT,
        limit: 100,
        args: (arg, t) => [
          arg(dappyID, t.UInt64), 
          arg(salePrice, t.UFix64)
        ]
      })
      addTx(res)
      await tx(res).onceSealed()
    } catch (error) {
      console.log(error)
    }

  }

  return {
    ...state,
    addToPack,
    removeFromPack,
    listDappyForSale
  }
}
