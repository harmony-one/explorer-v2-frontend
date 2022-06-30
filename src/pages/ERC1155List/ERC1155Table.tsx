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
import { ERC1155Icon } from "src/components/ui/ERC1155Icon";
import { CircleQuestion, StatusGood } from "grommet-icons";
import { isTokenBridged } from "../../utils";

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

export function ERC1155Table(props: TransactionTableProps) {
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
          data={data}
          border={{
            header: false,
            body: {
              color: "border",
              side: "bottom",
              size: "1px",
            },
          }}
          background={{header: 'unset'}}
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
      property: "icon",
      resizeable: false,
      size: "xxsmall",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "30px" }}
        ></Text>
      ),
      render: (data: Erc20) => {
        return <ERC1155Icon imageUrl={data.meta?.image} />;
      },
    },
    {
      property: "name",
      resizeable: false,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Name
        </Text>
      ),
      render: (data: Erc20) => <Box direction={'row'} style={{ display: 'flex', alignItems: 'center' }}>
        <Text size={'small'}>{data.name}</Text>
        {data.isBridged && <div style={{ marginLeft: "4px", height: '14px', cursor: 'pointer' }}>
          <Tip dropProps={{ align: { bottom: "top" }}} content={<TipContent showArrow={true} message={'Token is available on Harmony Bridge'} />}>
            <StatusGood size={'14px'} color={'successText'} />
          </Tip>
        </div>}
      </Box>,
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
      render: (data: Erc20) => <Address address={data.address} />,
    },
    // {
    //   property: "totalSupply",
    //   size: 'small',
    //   resizeable: false,
    //   header: (
    //     <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
    //       Total supply
    //     </Text>
    //   ),
    //   render: (data: Erc20) => {
    //     return <TokenValue value={data.totalSupply} formatNumber />;
    //   },
    // },
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
                message={`Last update block height: ${formatNumber(
                  +data.lastUpdateBlockNumber
                )}`}
              />
            }
          >
            <span style={{ marginLeft: "5px" }}>
              <CircleQuestion size="small" />
            </span>
          </Tip>
        </Box>
      ),
    },
  ];
}
