import React from 'react'
import Spinner from '../components/Spinner'
import './TxDetails.css'

export default function TxDetails({ id }) {
  return (
    <div className="tx__wrapper">
      <div className="tx__loader">
        <Spinner />
      </div>
      <div className="tx__content">
        <p>Tx: {id}</p>
      </div>
    </div>
  )
}
