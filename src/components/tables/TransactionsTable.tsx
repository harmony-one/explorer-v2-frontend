import React, { useEffect, useRef, useState } from "react";

import { Box, DataTable, Text, Spinner, ColumnConfig } from "grommet";
import { Filter, RPCTransactionHarmony } from "src/types";
import { useHistory } from "react-router-dom";
import { FormNextLink } from "grommet-icons";
import {
  Address,
  formatNumber,
  DateTime,
  PaginationNavigator,
  PaginationRecordsPerPage,
  ONEValue,
} from "src/components/ui";
import { TableComponent } from "./TableComponents";

function getColumns(props: any) {
  const { history } = props;
  return [
    {
      property: "shard",
      size: "xxsmall",
      resizeable: false,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Shard
        </Text>
      ),
      render: (data: RPCTransactionHarmony) => (
        <Box direction="row" gap="3px" align="center">
          <Text size="small">{data.shardID}</Text>
          <FormNextLink
            size="small"
            color="brand"
            style={{ marginBottom: "2px" }}
          />
          <Text size="small">{data.toShardID}</Text>
        </Box>
      ),
    },
    {
      property: "hash",
      size: "xsmall",
      resizeable: false,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Hash
        </Text>
      ),
      render: (data: RPCTransactionHarmony) => (
        <Text
          size="small"
          style={{ cursor: "pointer" }}
          onClick={() => {
            history.push(`/tx/${data.hash}`);
          }}
          color="brand"
        >
          <Address address={data.hash} isShort />
        </Text>
      ),
    },
    {
      property: "block_number",
      size: "260px",
      resizeable: false,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Block number
        </Text>
      ),
      render: (data: RPCTransactionHarmony) => {
        return (
          <Text
            size="small"
            style={{ cursor: "pointer" }}
            onClick={() => {
              history.push(`/block/${data.blockNumber}`);
            }}
            color="brand"
          >
            {formatNumber(+data.blockNumber)}
          </Text>
        );
      },
    },
    {
      property: "from",
      size: "large",
      resizeable: false,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          From
        </Text>
      ),
      render: (data: RPCTransactionHarmony) => <Address address={data.from} />,
    },
    {
      property: "to",
      size: "large",
      resizeable: false,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          To
        </Text>
      ),
      render: (data: RPCTransactionHarmony) => <Address address={data.to} />,
    },
    {
      property: "value",
      size: "380px",
      resizeable: false,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          ONEValue
        </Text>
      ),
      render: (data: RPCTransactionHarmony) => (
        <Box justify="center">
          <ONEValue value={data.value} timestamp={data.timestamp} />
        </Box>
      ),
    },
    {
      property: "timestamp", 
      resizeable: false,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300, width: '180px' }}>
          Timestamp
        </Text>
      ),
      render: (data: RPCTransactionHarmony) => (
        <Box direction="row" gap="xsmall" justify="end">
          <DateTime date={data.timestamp} />
        </Box>
      ),
    },
  ];
}

interface TransactionTableProps {
  rowDetails?: (row: any) => JSX.Element;
  data: any[];
  columns?: ColumnConfig<any>[];
  totalElements: number;
  limit: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  showIfEmpty?: boolean;
  emptyText?: string;
  hidePagination?: boolean;
  isLoading?: boolean;
  hideCounter?: boolean;
  minWidth?: string;
  noScrollTop?: boolean;
  step?: number;
  primaryKey?: string;
  showPages?: boolean
  textType?: string
}

export function TransactionsTable(props: TransactionTableProps) {
  const history = useHistory();
  const {
    data,
    totalElements,
    limit,
    step = 10,
    filter,
    setFilter,
    showIfEmpty,
    emptyText = "No data to display",
    columns,
    hidePagination,
    isLoading,
    hideCounter,
    noScrollTop,
    minWidth = "1310px",
    showPages = false,
    textType = 'transaction'
  } = props;

  const _IsLoading = isLoading;

  useEffect(() => {
    filter.offset = 0;
    setFilter(filter);
  }, [filter.limit]);

  return (
    <>
      <Box
        direction="row"
        justify={hidePagination ? "start" : "between"}
        pad={{ bottom: "small" }}
        margin={{ bottom: "small" }}
        border={{ size: "xsmall", side: "bottom", color: "border" }}
      >
        {!hideCounter ? (
          <Text style={{ flex: "1 1 100%" }}>
            <b>{Math.min(limit, data.length)}</b> {textType}
            {data.length !== 1 ? "s" : ""} shown
          </Text>
        ) : (
          <Box />
        )}
        {!hidePagination && (
          <PaginationNavigator
            onChange={setFilter}
            isLoading={isLoading}
            filter={filter}
            totalElements={totalElements}
            elements={data}
            noScrollTop={noScrollTop}
            property="block_number"
            showPages={showPages}
          />
        )}
      </Box>
      <Box
        style={{
          overflow: "auto",
          opacity: _IsLoading ? "0.4" : "1",
          transition: "0.1s all",
          minHeight: "600px",
        }}
      >
        {_IsLoading ? (
          <Box align={"center"} justify={"center"} flex>
            <Spinner size={"large"} />
          </Box>
        ) : !data.length && !_IsLoading ? (
          <Box style={{ height: "120px" }} justify="center" align="center">
            <Text size="small">{emptyText}</Text>
          </Box>
        ) : (
          <TableComponent
            alwaysOpenedRowDetails={props.rowDetails ? true : false}
            tableProps={{
              className: "g-table-header",
              style: { width: "100%", minWidth },
              columns: columns ? columns : getColumns({ history }),
              data: data,
              step,
              primaryKey: props.primaryKey ? props.primaryKey : undefined,
              border: {
                header: {
                  color: "brand",
                },
                body: {
                  color: "border",
                  side: "top",
                  size: "1px",
                },
              },
              rowDetails: props.rowDetails
                ? (row: any) => (
                    <div style={{ textAlign: "left" }}>
                      {props.rowDetails && props.rowDetails(row)}
                    </div>
                  )
                : undefined,
            }}
          />
        )}
      </Box>
      {!hidePagination && (
        <Box
          direction="row"
          justify="between"
          align="center"
          margin={{ top: "medium" }}
        >
          <PaginationRecordsPerPage filter={filter} onChange={setFilter} />
          <PaginationNavigator
            onChange={setFilter}
            isLoading={isLoading}
            filter={filter}
            totalElements={totalElements}
            elements={data}
            noScrollTop={noScrollTop}
            property="block_number"
            showPages={showPages}
          />
        </Box>
      )}
    </>
  );
}
