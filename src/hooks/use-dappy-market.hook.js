import { useEffect, useReducer } from "react";
import { marketDappyReducer } from "../reducer/marketDappyReducer";
import { generateDappies } from "../utils/dappies.utils";
import DappyClass from "../utils/DappyClass";

export default function useDappyMarket() {
  const [state, dispatch] = useReducer(marketDappyReducer, {
    loading: false,
    error: false,
    marketDappies: [],
    unlistedDappies: [],
  });

  useEffect(() => {
    fetchDappies();
  }, []);

  const fetchDappies = async () => {
    dispatch({ type: "PROCESSING MARKETDAPPIES" });
    dispatch({ type: "PROCESSING UNLISTEDDAPPIES" });
    try {
      let res = generateDappies();
      let marketDappies = Object.values(res).map((d) => {
        return new DappyClass(d?.templateID, d?.dna, d?.name, d?.price);
      });
      dispatch({
        type: "UPDATE MARKETDAPPIES",
        payload: marketDappies,
      });
    } catch (error) {
      console.log(error);
      dispatch({ type: "ERROR" });
    }
    try {
      let res = generateDappies();
      let unlistedDappies = Object.values(res).map((d) => {
        return new DappyClass(d?.templateID, d?.dna, d?.name, d?.price);
      });
      dispatch({ type: "UPDATE UNLISTEDDAPPIES", payload: unlistedDappies });
    } catch (err) {
      dispatch({ type: "ERROR" });
    }
  };

  const listDappyOnMarket = () => {
      console.log(`List dappy`)
      fetchDappies()
  }

  const removeDappyFromMarket = () => {
      console.log(`Remove dappy`)
      fetchDappies()
  }

  const buyDappyOnMarket = () => {
      console.log(`Buy dappy on market`)
      fetchDappies()
  }

  return {
      ...state,
      listDappyOnMarket,
      removeDappyFromMarket,
      buyDappyOnMarket
    };
}
