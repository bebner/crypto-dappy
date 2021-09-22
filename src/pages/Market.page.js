import React from "react";

import useDappyTemplates from "../hooks/use-dappy-templates.hook";
import DappyList from "../components/DappyList";
import Header from "../components/Header";
import ErrorLoadingRenderer from "../components/ErrorLoadingRenderer";
import { DEFAULT_DAPPIES } from "../config/dappies.config";

export default function Dappies() {
  const { data: dappyTemplates, loading, error } = useDappyTemplates();
  const dappyTemplates = DEFAULT_DAPPIES;
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
      <h4 className="app__subheader">Dappies on the Market</h4>
      <ErrorLoadingRenderer loading={loading} error={error}>
        <DappyList dappies={DEFAULT_DAPPIES} store />
      </ErrorLoadingRenderer>
      <hr className="app__hr"></hr>
      <h4 className="app__subheader">Your Unlisted Dappies</h4>
      <ErrorLoadingRenderer loading={loading} error={error}>
        <DappyList dappies={DEFAULT_DAPPIES} store />
      </ErrorLoadingRenderer>
    </>
  );
}
