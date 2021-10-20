import {  useReducer } from 'react'

export default function useUserPack() {
  const reducer = (state, action)  => {
    switch (action.type) {
      case 'ADD':
        //skip if dappy exists or total dappies is 4
        console.log(state.data)
        if (state.data.length >= 4) return { ...state }
        for (const d of state.data ) {
          if (d.id === action.payload.id) return { ...state}
        }
        const price = parseFloat(action.payload.price)
        return {
          ...state,
          data: [...state.data, action.payload],
          price: state.price + price
        }
      case 'NEW':
        return {
          ...state,
          data: [...state.data, action.payload],
          price: parseFloat(action.payload.price)
        }  
      case 'REMOVE':
        return {
          ...state,
          data: [...state.data, action.payload]
        }  
      default:
        throw new Error("Error in useUserPack reducer")
    }
  }

  const [state, dispatch] = useReducer( reducer, {
    data:[],
    price: 0.0
  })

  const addToPack = ({dappy}) => {
    dispatch({ type: 'ADD', payload: dappy})
  }

  const removeFromPack = async ({dappy}) => {
  }

  return {
    ...state,
    addToPack,
    removeFromPack
  }
}
