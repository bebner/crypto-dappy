import React, { useEffect} from 'react'
import DappyList from '../components/DappyList'
import Header from '../components/Header'
import { useUser } from '../providers/UserProvider'

import PackPanel from '../components/PackPanel.comp'
import BreedPanel from '../components/BreedPanel.comp'

export default function Collection() {
  const { collection, createCollection, deleteCollection, userDappies } = useUser()

  useEffect( () => {}, [userDappies])

  return (
    <>
      <Header
        title={<>My<span className="highlight">Dappies</span></>}
        subtitle={<>Here are the <span className="highlight">Dappies and Packs</span> you have collected</>}
      />

      {!collection ?
        <div className="btn btn-round" onClick={() => createCollection()}>Enable Collection</div> :
        <>
          <PackPanel />
          <BreedPanel />
          <DappyList dappies={userDappies} />
          <div className="btn btn-round" onClick={() => deleteCollection()}>Delete Collection</div>
        </>
      }

    </>
  )
}
