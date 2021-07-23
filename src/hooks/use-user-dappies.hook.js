import { useEffect, useReducer } from "react";
import { userDappyReducer } from "../reducer/userDappyReducer";
import DappyClass from "../utils/DappyClass";
import { DEFAULT_DAPPIES } from "../config/dappies.config";
import { mutate, query, tx } from "@onflow/fcl";
import { LIST_USER_DAPPIES } from "../flow/list-user-dappies.script";
import { MINT_DAPPY } from "../flow/mint-dappy.tx";

export default function useUserDappies(user, collection, getFUSDBalance) {
  const [state, dispatch] = useReducer(userDappyReducer, {
    oading: false,
    error: false,
    data: [],
  });

  useEffect(() => {
    const fetchUserDappies = async () => {
      dispatch({ type: "PROCESSING" });
      try {
        let res = await query({
          cadence: LIST_USER_DAPPIES,
          args: (arg, t) => [arg(user?.addr, t.Address)],
        });
        let mappedDappies = [];

        for (let key in res) {
          const element = res[key];
          let dappy = new DappyClass(
            element.templateID,
            element.dna,
            element.name,
            element.price,
            key
          );
          mappedDappies.push(dappy);
        }

        dispatch({ type: "SUCCESS", payload: mappedDappies });
      } catch (err) {
        dispatch({ type: "ERROR" });
      }
    };
    fetchUserDappies();
    //eslint-disable-next-line
  }, []);

  const mintDappy = async (templateID, amount) => {
    if (!collection) {
      alert(
        "You need to enable the collection first. Go to the tab Collection"
      );
      return;
    }
    try {
      let res = await mutate({
        cadence: MINT_DAPPY,
        limit: 55,
        args: (arg, t) => [arg(templateID, t.UInt32), arg(amount, t.UFix64)],
      });
      await tx(res).onceSealed();
      await getFUSDBalance();
      // await addDappy(templateID);
    } catch (error) {
      console.log(error);
    }
  };

  const addDappy = async (templateID) => {
    try {
      const dappy = DEFAULT_DAPPIES.find((d) => d?.templateID === templateID);
      const newDappy = new DappyClass(dappy.templateID, dappy.dna, dappy.name);
      dispatch({ type: "ADD", payload: newDappy });
    } catch (err) {
      console.log(err);
    }
  };

  const batchAddDappies = async (dappies) => {
    try {
      const allDappies = DEFAULT_DAPPIES;
      const dappyToAdd = allDappies.filter((d) =>
        dappies.includes(d?.templateID)
      );
      const newDappies = dappyToAdd.map(
        (d) => new DappyClass(d.templateID, d.dna, d.name)
      );
      for (let index = 0; index < newDappies.length; index++) {
        const element = newDappies[index];
        dispatch({ type: "ADD", payload: element });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return {
    ...state,
    mintDappy,
    addDappy,
    batchAddDappies,
  };
}
