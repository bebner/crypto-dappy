import { useEffect, useState } from 'react'
import { mutate, query, tx } from '@onflow/fcl'

import { CHECK_COLLECTION } from '../flow/check-collection.script'
import { DELETE_COLLECTION } from '../flow/delete-collection.tx'
import { CREATE_COLLECTION } from '../flow/create-collection.tx'
import { useTxs } from '../providers/TxProvider'

export default function useCollection(user) {
  const [loading, setLoading] = useState(true)
  const [collection, setCollection] = useState(null)
  const { addTx } = useTxs()

  useEffect(() => {
    if (!user?.addr) return
    const checkCollection = async () => {
      try {
        let res = await query({
          cadence: CHECK_COLLECTION,
          args: (arg, t) => [arg(user?.addr, t.Address)]
        })
        setCollection(res)
        setLoading(false)
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    }
    checkCollection()
    //eslint-disable-next-line
  }, [])

  const createCollection = async () => {
    let res = await mutate({
      cadence: CREATE_COLLECTION,
      limit: 55

    })
    addTx(res)
    await tx(res).onceSealed()
    setCollection(true)
  }

  const deleteCollection = async () => {
    try {
      let res = await mutate({
        cadence: DELETE_COLLECTION,
        limit: 75
      })
      addTx(res)
      await tx(res).onceSealed()
      setCollection(false)
    } catch (err) {
      console.log(err)
    }
  }

  return {
    loading,
    collection,
    createCollection,
    deleteCollection
  }
}
