export const userDappyReducer = (state, action) => {
  switch (action.type) {
    case 'PROCESSING':
      return {
        ...state,
        loading: true,
        error: false
      }
    case 'SUCCESS':
      const oldIDs = state.data?.map( v => v.serialNumber)
      const newDappies = oldIDs? 
        action.payload.filter( 
          v => !oldIDs.includes( v.serialNumber)
        ) : []
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload,
        newDappies: newDappies
      }
    case 'ADD':     
      return {
        ...state,
        data: [...state.data, action.payload],
        newDappies: [action.payload]
      }
    case 'ERROR':
      return {
        ...state,
        loading: false,
        error: true
      }
    default:
      throw new Error()
  }
}