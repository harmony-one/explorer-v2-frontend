import React from "react";

import { AnchorLink } from "./AnchorLink";

// @ts-ignore
export const TransactionHash = ({ hash, link = "tx" }) => {
  const url = `/${link}/${hash}`;
  return <AnchorLink to={url} label={hash} style={{ fontWeight: 400 }} />;
};
