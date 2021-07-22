import React, { createContext, useContext } from 'react'

import useUserDappies from '../hooks/use-user-dappies.hook'
import useCollection from '../hooks/use-collection.hook'
import useFUSD from '../hooks/use-fusd.hook'

const UserContext = createContext()

export default function UserProvider({ children }) {
  const { collection, createCollection, deleteCollection } = useCollection()
  const { data: balance, createFUSDVault, getFUSDBalance } = useFUSD()
  const { data: userDappies, addDappy, batchAddDappies, mintDappy } = useUserDappies()

  return (
    <UserContext.Provider
      value={{
        userDappies,
        mintDappy,
        addDappy,
        batchAddDappies,
        collection,
        createCollection,
        deleteCollection,
        balance,
        createFUSDVault,
        getFUSDBalance
      }}>

      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
