import React, { createContext, useContext } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import userUserPack from '../hooks/use-user-pack.hook'

const UserContext = createContext()

export default function MarketProvider({ children }) {

    const { 
        data: userPack, 
        price: packPrice, 
        addToPack, 
        removeFromPack,
        listDappyForSale } 
    = userUserPack()

    return (
        <UserContext.Provider
            value={{
                packPrice,
                userPack,
                addToPack,
                removeFromPack,
                listDappyForSale
            }}>
            <DndProvider backend={HTML5Backend}>
                {children}
            </DndProvider>
        </UserContext.Provider>
    )
}

export const useMarket = () => {
    return useContext(UserContext)
}
