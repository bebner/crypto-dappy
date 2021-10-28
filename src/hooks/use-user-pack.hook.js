import { useReducer } from 'react'
import { mutate, tx, config } from '@onflow/fcl'

import { useTxs } from '../providers/TxProvider'

import { PUT_DAPPY_STOREFRONT } from '../flow/put-dappy-storefront.tx'
import { PUT_PACK_STOREFRONT } from '../flow/put-pack-storefront.tx'
import { PURCHASE_DAPPY_STOREFRONT } from '../flow/purchase-dappy-storefront.tx'
import { PURCHASE_PACK_STOREFRONT } from '../flow/purchase-pack-storefront.tx'
import { REMOVE_GALLERY_LISTING } from '../flow/remove-gallery-listing.tx'

const PACK_MAX_CAP = 4

export default function useUserPack() {
  
  const { addTx, runningTxs } = useTxs()

  const reducer = (state, action) => {
    switch (action.type) {
      case 'ADD':
        //skip if dappy exists or total dappies is 4
        if (state.data.length >= PACK_MAX_CAP) return { ...state }
        for (const d of state.data) {
          if (d.serialNumber === action.payload.serialNumber) return { ...state }
        }
        const price = parseFloat(action.payload.price)
        return {
          ...state,
          data: [...state.data, action.payload],
          price: state.price + price
        }
      default:
        throw new Error("Error in useUserPack reducer")
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    data: [],
    price: 0.0
  })

  const addToPack = ({ dappy }) => {
    dispatch({ type: 'ADD', payload: dappy })
  }

  const removeFromPack = async ({ dappy }) => {
  }

  const purchaseDappy = async (dappy) => {

    if (runningTxs) {
      alert("Transactions are still running. Please wait for them to finish first.")
      return
    }

    const listingResourceID = dappy.listingResourceID
    const sellerAddress = dappy.sellerAddress
    
    try {
      let res = await mutate({
        cadence: PURCHASE_DAPPY_STOREFRONT,
        limit: 200,
        args: (arg, t) => [
          arg(listingResourceID, t.UInt64),
          arg(sellerAddress, t.Address)
        ]
      })
      addTx(res)
      await tx(res).onceSealed()
    } catch (error) {
      console.error(error, error.stack)
    }

    // TODO: merge this transaction with above
    try {
      const adminAddress = await config().get("0xGalleryContract")
      let res = await mutate({
        cadence: REMOVE_GALLERY_LISTING,
        limit: 200,
        args: (arg, t) => [
          arg(adminAddress, t.Address),
          arg(listingResourceID, t.UInt64)
        ]
      })
      addTx(res)
      await tx(res).onceSealed()
    } catch (error) {
      console.error(error, error.stack)
    }

  }

  const purchasePackStorefront = async (listingResourceID, sellerAddress) => {

    console.log(listingResourceID, sellerAddress)
    const adminAddress = await config().get("0xGalleryContract")
      
    try {
      let res = await mutate({
        cadence: PURCHASE_PACK_STOREFRONT,
        limit: 200,
        args: (arg, t) => [
          arg(adminAddress, t.Address),
          arg(listingResourceID, t.UInt64),
          arg(sellerAddress, t.Address)
        ]
      })
      addTx(res)
      await tx(res).onceSealed()
    } catch (error) {
      console.error(error, error.stack)
    }

  }

  const listPackForSale = async ( dappies, wantPrice) => {

    if (runningTxs) {
      alert("Transactions are still running. Please wait for them to finish first.")
      return
    }

    const dappyIDs = dappies.map( (value) => value.serialNumber)
    const salePrice = parseFloat(wantPrice).toFixed(8)
    const adminAddress = await config().get("0xGalleryContract")

    try {
      let res = await mutate({
        cadence: PUT_PACK_STOREFRONT,
        limit: 300,
        args: (arg, t) => [
          arg(dappyIDs, t.Array(t.UInt64)), 
          arg(salePrice, t.UFix64),
          arg(adminAddress, t.Address)
        ]
      })
      addTx(res)
      await tx(res).onceSealed()
    } catch (error) {
      console.error(error, error.stack)
    }
    
  }

  const listDappyForSale = async (dappy, wantPrice) => {

    if (runningTxs) {
      alert("Transactions are still running. Please wait for them to finish first.")
      return
    }

    const dappyID = dappy.serialNumber
    const salePrice = parseFloat(wantPrice).toFixed(8)
    const adminAddress = await config().get("0xGalleryContract")

    try {
      let res = await mutate({
        cadence: PUT_DAPPY_STOREFRONT,
        limit: 200,
        args: (arg, t) => [
          arg(dappyID, t.UInt64),
          arg(salePrice, t.UFix64),
          arg(adminAddress, t.Address)
        ]
      })
      addTx(res)
      await tx(res).onceSealed()
    } catch (error) {
      console.error(error, error.stack)
    }

  }

  return {
    ...state,
    addToPack,
    removeFromPack,
    listDappyForSale,
    listPackForSale,
    purchaseDappy,
    purchasePackStorefront
  }
}
