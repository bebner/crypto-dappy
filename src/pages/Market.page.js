import React from "react";

import DappyList from "../components/DappyList";
import Header from "../components/Header";
import ErrorLoadingRenderer from "../components/ErrorLoadingRenderer";
import useDappyMarket from "../hooks/use-dappy-market.hook";

export default function Dappies() {
  const {
    marketDappies,
    unlistedDappies,
    loadingMarketDappies,
    loadingUnlistedDappies,
    error,
  } = useDappyMarket();
  console.log(`md in MP: ${marketDappies}`);
  console.log(`ud in MP: ${unlistedDappies}`);
  return (
    <>
      <Header
        title={
          <>
            <span className="highlight">Market</span>Place
          </>
        }
        subtitle={
          <>
            Buy <span className="highlight">dappies</span> on the market, and
            list your own!
          </>
        }
      />
      <h4 className="app__subheader">Your Unlisted Dappies</h4>
      <ErrorLoadingRenderer loading={loadingUnlistedDappies} error={error}>
        <DappyList dappies={unlistedDappies} />
      </ErrorLoadingRenderer>
      <hr className="app__hr"></hr>
      <h4 className="app__subheader">Dappies on the Market</h4>
      <ErrorLoadingRenderer loading={loadingMarketDappies} error={error}>
        <DappyList dappies={marketDappies} listed/>
      </ErrorLoadingRenderer>
    </>
  );
}
