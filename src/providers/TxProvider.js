import React, { useContext, useEffect, useState } from 'react'
import { send, getTransactionStatus, decode, tx } from '@onflow/fcl'

import TxDetails from '../components/TxDetails'
import Spinner from '../components/Spinner'

const txContext = React.createContext()

export default function TxProvider({ children }) {
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLocalTxs()
    //eslint-disable-next-line
  }, [])

  const renderTxs = () => {
    return (
      <div className='txs__list'>
        {txs.map(tx => <TxDetails id={tx?.id} key={tx?.id} />)}
      </div>
    )
  }

  const getLocalTxs = async () => {
    const txString = window.localStorage.getItem('txs')

    if (!txString || txString.length === 0) {
      setLoading(false)
      return
    }

    const localTxs = txString?.split(",")
    let runningTxs = []

    for (let index = 0; index < localTxs.length; index++) {
      const id = localTxs[index];
      const t = await getTxStatus(id)
      if (t?.status === 4) {
        continue
      }
      tx(id).subscribe(s => updateTxStatus(s?.status, id))
      runningTxs.push(id)
    }

    localStorage.setItem('txs', runningTxs.toString())
    setTxs(runningTxs.map(t => ({ id: t })))
    setLoading(false)
  }

  const addTx = (txID) => {
    let transaction = { id: txID }
    setTxs(prev => [...prev, transaction])
    tx(txID).subscribe(s => updateTxStatus(s?.status, transaction?.id))
    window.localStorage.setItem('txs', [...txs, transaction?.id].toString())
  }

  const updateTxStatus = (status, txID) => {
    if (status === 4) {
      removeTx(txID)
      return
    }
    let tx = txs.find(t => t.id === txID)
    let oldTxs = txs.filter(t => t.id !== txID)
    if (!tx) return
    let updatedTx = { ...tx, status }
    setTxs([...oldTxs, updatedTx])
  }

  const removeTx = (txID) => {
    let newTxs = txs.filter(t => t.id !== txID)
    setTxs(newTxs)
  }

  const getTxStatus = async (txID) => {
    const status = await send([
      getTransactionStatus(txID),
    ])
      .then(decode);
    return status
  }

  if (loading) return <Spinner />

  return (
    <txContext.Provider value={{
      runningTxs: txs.length !== 0,
      addTx,
    }}>
      {renderTxs()}
      {children}
    </txContext.Provider>
  )
}

export function useTxs() {
  return useContext(txContext)
}