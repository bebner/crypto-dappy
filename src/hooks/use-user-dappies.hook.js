import { useEffect, useReducer } from 'react'
import { userDappyReducer } from '../reducer/userDappyReducer'
import DappyClass from '../utils/DappyClass'
import { DEFAULT_DAPPIES } from '../config/dappies.config'

export default function useUserDappies() {
  const [state, dispatch] = useReducer(userDappyReducer, {
    oading: false,
    error: false,
    data: []
  })

  useEffect(() => {
    const fetchUserDappies = async () => {
      dispatch({ type: 'PROCESSING' })
      try {
        dispatch({ type: 'SUCCESS', payload: [] })
      } catch (err) {
        dispatch({ type: 'ERROR' })
      }
    }
    fetchUserDappies()
    //eslint-disable-next-line
  }, [])

  const mintDappy = async (templateID, amount) => {
    try {
      await addDappy(templateID)
    } catch (error) {
      console.log(error)
    }
  }

  const addDappy = async (templateID) => {
    try {
      const dappy = DEFAULT_DAPPIES.find(d => d?.templateID === templateID)
      const newDappy = new DappyClass(dappy.templateID, dappy.dna, dappy.name)
      dispatch({ type: 'ADD', payload: newDappy })
    } catch (err) {
      console.log(err)
    }
  }

  const batchAddDappies = async (dappies) => {
    try {
      const allDappies = DEFAULT_DAPPIES
      const dappyToAdd = allDappies.filter(d => dappies.includes(d?.templateID))
      const newDappies = dappyToAdd.map(d => new DappyClass(d.templateID, d.dna, d.name))
      for (let index = 0; index < newDappies.length; index++) {
        const element = newDappies[index];
        dispatch({ type: 'ADD', payload: element })
      }
    } catch (err) {
      console.log(err)
    }
  }

  return {
    ...state,
    mintDappy,
    addDappy,
    batchAddDappies
  }
}
