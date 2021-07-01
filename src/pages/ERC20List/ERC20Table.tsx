import React from "react";

import { Box, DataTable, Text, Spinner, Tip } from "grommet";
import { Filter } from "src/types";
import { useHistory } from "react-router-dom";
import {
  Address,
  formatNumber,
  PaginationNavigator,
  PaginationRecordsPerPage,
  TipContent,
  TokenValue,
  TPaginationAction,
} from "src/components/ui";
import { Erc20 } from "../../hooks/ERC20_Pool";
import { CircleQuestion } from "grommet-icons";

interface TransactionTableProps {
  data: any[];
  totalElements: number;
  limit: number;
  filter: Filter;
  setFilter: (filter: Filter, action?: TPaginationAction) => void;
  showIfEmpty?: boolean;
  emptyText?: string;
  isLoading?: boolean;
  minWidth?: string;
}

export function ERC20Table(props: TransactionTableProps) {
  const history = useHistory();
  const {
    data,
    totalElements,
    limit,
    filter,
    setFilter,
    emptyText = "No data to display",
    isLoading,
    minWidth = "1310px",
  } = props;

  if (isLoading) {
    return (
      <Box style={{ height: "700px" }} justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Box style={{ height: "120px" }} justify="center" align="center">
        <Text size="small">{emptyText}</Text>
      </Box>
    );
  }

  return (
    <>
      <Box
        direction="row"
        justify={"between"}
        pad={{ bottom: "small" }}
        margin={{ bottom: "small" }}
        border={{ size: "xsmall", side: "bottom", color: "border" }}
      >
        <Text style={{ flex: "1 1 100%" }}>
          <b>{Math.min(limit, data.length)}</b> token
          {data.length !== 1 ? "s" : ""} shown
        </Text>
        <PaginationNavigator
          onChange={setFilter}
          filter={filter}
          totalElements={totalElements}
          elements={data}
          showPages
          property="block_number"
        />
      </Box>
      <Box style={{ overflow: "auto" }}>
        <DataTable
          className={"g-table-header"}
          style={{ width: "100%", minWidth }}
          columns={getColumns({ history })}
          primaryKey={"address"}
          data={data}
          border={{
            header: {
              color: "brand",
            },
            body: {
              color: "border",
              side: "top",
              size: "1px",
            },
          }}
        />
      </Box>
      <Box
        direction="row"
        justify="between"
        align="center"
        margin={{ top: "medium" }}
      >
        <PaginationRecordsPerPage filter={filter} onChange={setFilter} />
        <PaginationNavigator
          onChange={setFilter}
          filter={filter}
          totalElements={totalElements}
          elements={data}
          showPages
          property="block_number"
        />
      </Box>
    </>
  );
}

function getColumns(props: any) {
  return [
    {
      property: "name",
      size: "small",
      resizeable: false,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Name
        </Text>
      ),
      render: (data: Erc20) => <Text size="small">{data.name}</Text>,
    },
    {
      property: "symbol",
      size: "xsmall",
      resizeable: false,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Symbol
        </Text>
      ),
      render: (data: Erc20) => <Text size="small">{data.symbol}</Text>,
    },
    {
      property: "address",
      primary: true,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Address
        </Text>
      ),
      render: (data: Erc20) => <Address address={data.address} displayHash />,
    },
    {
      property: "totalSupply",
      size: "small",
      resizeable: false,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Circulating Supply
        </Text>
      ),
      render: (data: Erc20) => {
        return (
          <Box direction={"row"}>
            <TokenValue
              value={data.circulating_supply}
              tokenAddress={data.address}
              formatNumber
              hideSymbol
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
              <span style={{ marginLeft: "5px", marginTop: "2px" }}>
                <CircleQuestion size="small" />
              </span>
            </Tip>
          </Box>
        );
      },
    },
    {
      property: "totalSupply",
      size: "small",
      resizeable: false,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Total supply
        </Text>
      ),
      render: (data: Erc20) => {
        return (
          <Box direction={"row"}>
            <TokenValue
              value={data.totalSupply}
              tokenAddress={data.address}
              formatNumber
              hideSymbol
            />
            <Tip
              dropProps={{ align: { right: "left" } }}
              content={
                <TipContent
                  message={`last update block height ${formatNumber(
                    +data.lastUpdateBlockNumber
                  )}`}
                />
              }
              plain
            >
              <span style={{ marginLeft: "5px", marginTop: "2px" }}>
                <CircleQuestion size="small" />
              </span>
            </Tip>
          </Box>
        );
      },
    },
    {
      property: "holders",
      size: "small",
      resizeable: false,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Holders
        </Text>
      ),
      render: (data: Erc20) => (
        <Box direction={"row"} justify={"end"}>
          <Text size="small" style={{ fontWeight: 300 }}>
            {formatNumber(+data.holders)}
          </Text>
          <Tip
            dropProps={{ align: { right: "left" } }}
            content={
              <TipContent
                message={`last update block height ${formatNumber(
                  +data.lastUpdateBlockNumber
                )}`}
              />
            }
            plain
          >
            <span style={{ marginLeft: "5px", marginTop: "2px" }}>
              <CircleQuestion size="small" />
            </span>
          </Tip>
        </Box>
      ),
    },
  ];
}
