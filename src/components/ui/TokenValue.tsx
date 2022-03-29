import { Text } from "grommet";
import React from "react";
import Big from "big.js";
import { formatNumber as _formatNumber } from "src/components/ui/utils";

import { useERC20Pool } from "src/hooks/ERC20_Pool";
import { useERC721Pool } from "src/hooks/ERC721_Pool";
import styled from "styled-components";

interface ONEValueProps {
  value: string | number;
  tokenAddress?: string;
  style?: React.CSSProperties;
  formatNumber?: boolean;
  hideSymbol?: boolean;
  isShort?: boolean;
}

Big.DP = 21;
Big.NE = -20;
Big.PE = 15;

const TextWrapper = styled(Text)<{ isShort: boolean }>`
  ${(props) => props.isShort &&
  `
    width: 200px;
    display: flex;
  
    b {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `
  }
`

// @ts-ignore
export const TokenValue = (props: ONEValueProps) => {
  const {
    value,
    tokenAddress = "",
    style,
    formatNumber,
    hideSymbol = false,
    isShort = false
  } = props;
  const erc20Map = useERC20Pool();
  const erc721Map = useERC721Pool();
  //TODO remove hardcode
  const tokenInfo: any = erc20Map[tokenAddress] ||
    erc721Map[tokenAddress] || { decimals: 14, symbol: "" };

  if (!("decimals" in tokenInfo)) {
    tokenInfo.decimals = 0;
  }

  if (value === "0" || value === 0) {
    return <Text size="small">—</Text>;
  }

  if (!value) {
    return null;
  }

  const bi = Big(value).div(10 ** tokenInfo.decimals);
  const v = formatNumber ? _formatNumber(bi.toNumber()) : bi.toString();

  return (
    <TextWrapper size="small" isShort={isShort} style={style}>
      <b>{v}</b> {hideSymbol ? null : tokenInfo.symbol}
    </TextWrapper>
  );
};
