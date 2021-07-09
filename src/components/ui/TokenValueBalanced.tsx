import { Box, Text } from "grommet";
import React, { useEffect, useState } from "react";
import Big from "big.js";
import { formatNumber as _formatNumber } from "src/components/ui/utils";

import { useERC20Pool } from "src/hooks/ERC20_Pool";
import { useERC721Pool } from "src/hooks/ERC721_Pool";
import { BinancePairs } from "src/hooks/BinancePairHistoricalPrice";
import { getBinancePairPrice } from "src/api/client";
import { IPairPrice } from "src/api/client.interface";
import { AnchorLink } from "./AnchorLink";
import { useERC1155Pool } from "src/hooks/ERC1155_Pool";

interface ONEValueProps {
  value: string | number;
  tokenAddress?: string;
  style?: React.CSSProperties;
  formatNumber?: boolean;
  direction?: "row" | "column";
}

Big.DP = 40;
Big.NE = -20;
Big.PE = 20;

// @ts-ignore
export const TokenValueBalanced = (props: ONEValueProps) => {
  const [dollar, setDollar] = useState<IPairPrice>({} as any);
  const { value, tokenAddress = "", style, formatNumber } = props;
  const erc20Map = useERC20Pool();
  const erc721Map = useERC721Pool();
  const erc1155Map = useERC1155Pool();
  const { direction = "column" } = props;

  let pairSymbol = BinancePairs.find(
    (item) => item.hrc20Address === tokenAddress
  );

  useEffect(() => {
    const getContracts = async () => {
      try {
        let contracts: any = await (pairSymbol?.symbol
          ? getBinancePairPrice([`${pairSymbol?.symbol}USDT`])
          : Promise.resolve({}));

        setDollar(contracts);
      } catch (err) {
        setDollar({} as any);
      }
    };
    getContracts();
  }, [pairSymbol?.symbol]);

  //TODO remove hardcode
  const tokenInfo: any = erc20Map[tokenAddress] ||
    erc721Map[tokenAddress] ||
    erc1155Map[tokenAddress] || { decimals: 0, symbol: "" };

  if (!("decimals" in tokenInfo)) {
    tokenInfo.decimals = 0;
  }

  if (!value) {
    return null;
  }

  const dollarPrice =
    dollar && dollar.lastPrice
      ? Big(value)
          .times(+dollar.lastPrice)
          .div(10 ** tokenInfo.decimals)
      : 0;

  const bi = Big(value).div(10 ** tokenInfo.decimals);
  const v = formatNumber ? _formatNumber(bi.toNumber()) : bi.toString();

  return (
    <Text size="small" style={style}>
      <b>
        {dollar && dollar.lastPrice ? (
          <Box direction={direction}>
            <Text size={"small"}>
              {`${v}`}
              <AnchorLink to={"/hrc20"} label={`${tokenInfo.symbol}`} />
            </Text>
            <Text size={"small"} style={{ paddingLeft: "0.3em" }}>
              {`($${dollarPrice.toFixed(2).toString()})`}
            </Text>
          </Box>
        ) : (
          <Text size={"small"}>
            {`${v}`}{" "}
            <AnchorLink
              to={`/address/${tokenInfo.address}`}
              label={`${tokenInfo.symbol}`}
            />
          </Text>
        )}
      </b>
    </Text>
  );
};
