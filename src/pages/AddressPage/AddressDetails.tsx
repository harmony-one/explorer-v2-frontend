import React from "react";
import { Box, Text, Tip } from "grommet";
import {
  Address,
  ExpandString,
  formatNumber,
  ONEValue,
  TipContent,
  TokenValue,
} from "src/components/ui";
import { AddressDetails } from "src/types";
import { TokensInfo } from "./TokenInfo";
import { Erc20, useERC20Pool } from "src/hooks/ERC20_Pool";
import { ONEValueDropdown } from "src/components/ui/OneValueDropdown";
import { binanceAddressMap } from "src/config/BinanceAddressMap";
import { useERC1155Pool } from "src/hooks/ERC1155_Pool";
import { CircleQuestion } from "grommet-icons";

interface AddressDetailsProps {
  address: string;
  contracts: AddressDetails | null;
  tokens: any[];
  balance?: string;
}

export function AddressDetailsDisplay(props: AddressDetailsProps) {
  const { address, contracts, tokens, balance } = props;
  const erc20Map = useERC20Pool();
  const erc1155Map = useERC1155Pool();

  const erc20Token = erc20Map[address] || null;
  const type = getType(contracts, erc20Token);
  const erc1151data = erc1155Map[address] || {};
  const { meta = {}, ...restErc1151data } = erc1151data;

  const data = {
    ...contracts,
    ...erc20Token,
    token: tokens,
    balance,
    ...restErc1151data,
    ...meta,
    address,
  };

  if (!data) {
    return null;
  }

  const items: string[] = Object.keys(data);

  return (
    <Box>
      {items.sort(sortByOrder).map((i) => (
        //@ts-ignore
        <DetailItem key={i} name={i} data={data} type={type} />
      ))}
    </Box>
  );
}

export const Item = (props: { label: any; value: any }) => {
  return (
    <Box
      direction="row"
      align={"center"}
      margin={{ bottom: "small" }}
      pad={{ bottom: "small" }}
      border={{ size: "xsmall", side: "bottom", color: "border" }}
    >
      <Text
        style={{ width: "20%" }}
        color="minorText"
        size="small"
        margin={{ right: "xsmall" }}
      >
        {props.label}
      </Text>
      <Text style={{ width: "80%", wordBreak: "break-all" }} size="small">
        {props.value}
      </Text>
    </Box>
  );
};

function DetailItem(props: { data: any; name: string; type: TAddressType }) {
  const { data, name, type } = props;

  if (
    !addressPropertyDisplayNames[name] ||
    !addressPropertyDisplayValues[name] ||
    data[name] === null
  ) {
    return null;
  }

  return (
    <Item
      label={addressPropertyDisplayNames[name](data, { type })}
      value={addressPropertyDisplayValues[name](data[name], data, { type })}
    />
  );
}

const addressPropertyDisplayNames: Record<
  string,
  (data: any, options: { type: TAddressType }) => React.ReactNode
> = {
  address: () => {
    return "Address";
  },
  value: () => "Value",
  creatorAddress: () => "Creator",
  // solidityVersion: () => "Solidity version",
  meta: () => "Meta",
  balance: () => "Balance",
  // bytecode: () => "Bytecode",
  token: () => "Token",
  name: () => "Name",
  symbol: () => "Symbol",
  decimals: () => "Decimals",
  totalSupply: () => "Total Supply",
  holders: () => "Holders",
  description: () => "Description",
  transactionHash: () => "Transaction Hash",
  circulating_supply: () => "Circulating Supply",
};

const addressPropertyDisplayValues: Record<
  string,
  (value: any, data: any, options: { type: TAddressType }) => React.ReactNode
> = {
  address: (value, data, options: { type: TAddressType }) => {
    return (
      <>
        <Address address={value} displayHash />
        {binanceAddressMap[value] ? ` (${binanceAddressMap[value]})` : null}
      </>
    );
  },
  value: (value) => <TokenValue value={value} />,
  creatorAddress: (value) => <Address address={value} />,
  // solidityVersion: (value) => value,
  IPFSHash: (value) => value,
  meta: (value) => value,
  // bytecode: (value) => <ExpandString value={value || ""} />,
  balance: (value) => (
    <Box width={"550px"}>
      <ONEValueDropdown value={value} />
    </Box>
  ),
  token: (value) => <TokensInfo value={value} />,
  name: (value) => value,
  symbol: (value) => value,
  decimals: (value) => value,
  totalSupply: (value, data) => (
    <Box direction={"row"}>
      <TokenValue
        value={value}
        tokenAddress={data.address}
        hideSymbol
        formatNumber
      />
      <Tip
        dropProps={{ align: { left: "right" } }}
        content={
          <TipContent
            message={`last update block height ${formatNumber(
              +data.lastUpdateBlockNumber
            )}`}
          />
        }
        plain
      >
        <span style={{ marginLeft: "5px" }}>
          <CircleQuestion size="small" />
        </span>
      </Tip>
    </Box>
  ),
  holders: (value: string, data: any) => {
    return (
      <Box direction={"row"}>
        <>{formatNumber(+value)}</>
        <Tip
          dropProps={{ align: { left: "right" } }}
          content={
            <TipContent
              message={`last update block height ${formatNumber(
                +data.lastUpdateBlockNumber
              )}`}
            />
          }
          plain
        >
          <span style={{ marginLeft: "5px" }}>
            <CircleQuestion size="small" />
          </span>
        </Tip>
      </Box>
    );
  },
  description: (value) => <>{value}</>,
  transactionHash: (value) => <Address address={value} type={"tx"} />,
  circulating_supply: (value, data) => (

    <Box direction={"row"}>
      <TokenValue
        value={value}
        tokenAddress={data.address}
        hideSymbol
        formatNumber
      />
      <Tip
        dropProps={{ align: { left: "right" } }}
        content={
          <TipContent
            message={`last update block height ${formatNumber(
              +data.lastUpdateBlockNumber
            )}`}
          />
        }
        plain
      >
        <span style={{ marginLeft: "5px" }}>
          <CircleQuestion size="small" />
        </span>
      </Tip>
    </Box>

  ),
};

function sortByOrder(a: string, b: string) {
  return addressPropertyOrder[a] - addressPropertyOrder[b];
}

const addressPropertyOrder: Record<string, number> = {
  address: 9,
  value: 10,
  balance: 11,
  token: 12,
  transactionHash: 10,
  creatorAddress: 13,

  name: 20,
  symbol: 21,
  decimals: 22,
  totalSupply: 23,
  circulating_supply: 23,
  holders: 24,

  solidityVersion: 31,
  IPFSHash: 32,
  meta: 33,
  bytecode: 34,
  sourceCode: 34,
};

type TAddressType = "address" | "contract" | "erc20" | "erc721" | "erc1155";

export function getType(
  contracts: AddressDetails | null,
  erc20Token: Erc20
): TAddressType {
  if (!!contracts && !!erc20Token) {
    return "erc20";
  }

  if (!!contracts) {
    return "contract";
  }

  return "address";
}
