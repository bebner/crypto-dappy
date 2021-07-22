import { useEffect, useReducer } from "react";
import { query } from '@onflow/fcl'

import { defaultReducer } from "../reducer/defaultReducer";

export function useQuery(CODE, ARGS = []) {
  const [state, dispatch] = useReducer(defaultReducer, {
    loading: false,
    error: false,
    data: []
  })

  const args = (arg, t) => {
    let items = ARGS.map(a => arg(a.value, t[a.type]))
    return items
  }

  useEffect(() => {
    let cancelRequest = false;
    const runQuery = async () => {
      dispatch({ type: 'PROCESSING' })
      try {
        const result = await query({ cadence: CODE, args })
        if (cancelRequest) return;
        dispatch({ type: 'SUCCESS', payload: result })
      } catch (error) {
        dispatch({ type: 'ERROR' })
      }
    }
    runQuery()

    return function cleanup() {
      cancelRequest = true;
    }
    //eslint-disable-next-line
  }, [])

  return [state]
}
