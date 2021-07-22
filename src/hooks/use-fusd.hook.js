import { useEffect, useReducer } from 'react'
import { defaultReducer } from '../reducer/defaultReducer'

export default function useFUSD() {
  const [state, dispatch] = useReducer(defaultReducer, {
    loading: true,
    error: false,
    data: null
  })

  useEffect(() => {
    getFUSDBalance();
    //eslint-disable-next-line 
  }, [])

  const getFUSDBalance = async () => {
    dispatch({ type: 'PROCESSING' })
    try {
      dispatch({ type: 'SUCCESS', payload: "100.00000000" })
    } catch (err) {
      dispatch({ type: 'ERROR' })
      console.log(err)
    }
  }

  return {
    ...state,
    getFUSDBalance
  }
}
