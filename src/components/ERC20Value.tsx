import React from "react";
import { useERC20Pool } from "src/hooks/ERC20_Pool";
import Big from "big.js";
import { formatNumber as _formatNumber } from "src/components/ui/utils";

export function ERC20Value(props: {
  tokenAddress: string;
  value: string | number;
}) {
  const { tokenAddress, value } = props;
  const erc20Map = useERC20Pool();

  const tokenInfo: any = erc20Map[tokenAddress];

  const bi = tokenInfo.decimals
    ? Big(value).div(10 ** tokenInfo.decimals)
    : value;

  const v = bi.toString();

  return (
    <>
      {v} {tokenInfo.symbol ? tokenInfo.symbol : ""}
    </>
  );
}
