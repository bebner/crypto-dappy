import { useEffect, useReducer } from 'react'
import { defaultReducer } from '../reducer/defaultReducer'
import DappyClass from '../utils/DappyClass'
import { DEFAULT_DAPPIES } from '../config/dappies.config'

export default function useDappyTemplates() {
  const [state, dispatch] = useReducer(defaultReducer, { loading: false, error: false, data: [] })

  useEffect(() => {
    const fetchDappyTemplates = async () => {
      dispatch({ type: 'PROCESSING' })
      try {
        let res = DEFAULT_DAPPIES
        let mappedDappies = Object.values(res).map(d => {
          return new DappyClass(d?.templateID, d?.dna, d?.name, d?.price)
        })
        dispatch({ type: 'SUCCESS', payload: mappedDappies })
      } catch (err) {
        dispatch({ type: 'ERROR' })
      }
    }
    fetchDappyTemplates()
  }, [])

  return state
}
