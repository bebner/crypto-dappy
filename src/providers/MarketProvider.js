import React, { createContext, useContext } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import userUserPack from '../hooks/use-user-pack.hook'
import useDappyPacks from '../hooks/use-dappy-packs.hook'
import useBreedDappies from '../hooks/use-breed-dappies.hook'

const UserContext = createContext()

export default function MarketProvider({ children }) {

    const {
        data: userPack,
        price: packPrice,
        addToPack,
        removeFromPack,
        listDappyForSale,
        listPackForSale,
        purchaseDappy,
        purchasePackStorefront
    }
    = userUserPack()

    const {
        data: dappyPacks,
        fetchDappiesOfPack, 
        mintFromPack, 
        fetchPackDetails
    } = useDappyPacks()

    const {
        data: mates,
        addMate, 
        breedDappies
    } = useBreedDappies()




    return (
        <UserContext.Provider
            value={{
                packPrice,
                userPack,
                addToPack,
                removeFromPack,
                listDappyForSale,
                listPackForSale,
                purchaseDappy,
                purchasePackStorefront,
                dappyPacks,
                fetchDappiesOfPack, 
                mintFromPack, 
                fetchPackDetails,
                mates,
                addMate, 
                breedDappies
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
