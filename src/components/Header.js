import React from "react";
export default function Header({ title, subtitle, subsubtitle }) {
  return (
    <>
      <img
        src={`${process.env.PUBLIC_URL}/assets/DappyPink.png`}
        width="200px"
        alt="Dappy"
      />
      <h1 className="app__title">{title}</h1>
      <h3 className="app__subtitle">{subtitle}</h3>
    </>
  );
}
