/*
    *Initial State*
    {
        loadingMarketDappies: false,
        loadingUnlistedDappies: false,
        error: false,
        marketDappies: [],
        unlistedDappies: []
    }
*/

export const marketDappyReducer = (state, action) => {
  switch (action.type) {
    case "PROCESSING MARKETDAPPIES":
      return {
        ...state,
        loadingMarketDappies: true,
        error: false,
      };
    case "PROCESSING UNLISTEDDAPPIES":
      return {
        ...state,
        loadingUnlistedDappies: true,
        error: false,
      };
    case "UPDATE MARKETDAPPIES":
      return {
        ...state,
        loadingMarketDappies: false,
        error: false,
        marketDappies: action.payload,
      };
    case "UPDATE UNLISTEDDAPPIES":
      return {
        ...state,
        loadingUnlistedDappies: false,
        error: false,
        unlistedDappies: action.payload,
      };
    case "ERROR":
      return {
        ...state,
        loadingUnlistedDappies: false,
        loadingMarketDappies: false,
        error: true,
      };
    default:
      throw new Error();
  }
};
