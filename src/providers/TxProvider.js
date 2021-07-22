import React, { useContext, useEffect, useState } from 'react'

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
    setTxs([])
    setLoading(false)
  }

  const addTx = (txID) => {
    console.log("Add txID")
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