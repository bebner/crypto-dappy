import React from 'react'
import DappyList from '../components/DappyList'
import Header from '../components/Header'
import { useUser } from '../providers/UserProvider'


export default function Collection() {
  const { collection, createCollection, deleteCollection, userDappies } = useUser()

  return (
    <>
      <Header
        title={<>My<span className="highlight">Dappies</span></>}
        subtitle={<>Here are the <span className="highlight">Dappies and Packs</span> you have collected</>}
      />

      {!collection ?
        <div className="btn btn-round" onClick={() => createCollection()}>Enable Collection</div> :
        <>
          <DappyList dappies={userDappies} />
          <div className="btn btn-round" onClick={() => deleteCollection()}>Delete Collection</div>
        </>
      }
    </>
  )
}
