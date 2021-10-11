import React, { useState } from "react";
import { Box, Text } from "grommet";

import { TransactionsTable } from "src/components/tables/TransactionsTable";
import { Filter, InternalTransaction } from "src/types";
import {
  Address,
  ONEValue,
  PaginationNavigator,
  TransactionType,
} from "src/components/ui";
import { DisplaySignatureMethod } from "src/web3/parseByteCode";

interface InternalTransactionListProps {
  list: InternalTransaction[];
  hash: string;
  timestamp: string;
}

export function InternalTransactionList(props: InternalTransactionListProps) {
  const limitValue = localStorage.getItem("tableLimitValue");

  const initFilter: Filter = {
    offset: 0,
    limit: limitValue ? +limitValue : 25,
    orderBy: "block_number",
    orderDirection: "desc",
    filters: [{ type: "gte", property: "block_number", value: 0 }],
  };

  const { list, hash, timestamp } = props;
  const [filter, setFilter] = useState<Filter>(initFilter);

  const { limit = 10, offset = 0 } = filter;
  const pageSize = 10;
  const curPage = +(+offset / limit).toFixed(0) + 1;

  const data = list
    .sort((a, b) => (a.index > b.index ? 1 : -1))
    .slice(pageSize * (curPage - 1), pageSize * curPage)
    .map((item) => ({ ...item }));

  return (
    <Box margin={{ top: "medium" }}>
      <TransactionsTable
        columns={getColumns({ timestamp })}
        data={data.sort((a, b) => (a.index > b.index ? 1 : -1))}
        totalElements={data.length}
        step={data.length}
        showIfEmpty
        emptyText={"No Internal Transactions for this hash " + hash}
        limit={+limit}
        filter={filter}
        setFilter={(newFilter) => {
          if (newFilter.limit !== initFilter.limit) {
            localStorage.setItem("tableLimitValue", "10");
          }

          setFilter(newFilter);
        }}
        minWidth="960px"
        primaryKey={"index"}
        rowDetails={(row) => (
          <DisplaySignatureMethod
            internalTransaction={row}
            key={`${row.from}_${row.to}`}
          />
        )}
      />
    </Box>
  );
}

function getColumns(props?: any) {
  const { timestamp } = props;

  return [
    {
      property: "type",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Type
        </Text>
      ),
      render: (data: InternalTransaction) => (
        <Text size="small">
          <TransactionType type={data.type} />
        </Text>
      ),
    },
    /*  {
      property: "method",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Suggested Method
        </Text>
      ),
      render: (data: InternalTransaction) => {
        let signature;
        try {
          // @ts-ignore
          signature =
            data.signatures &&
            data.signatures.map((s) => s.signature)[0].split("(")[0];
        } catch (err) {}

        return <Text size="small">{signature || "—"}</Text>;
      },
    },*/
    {
      property: "from",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          From
        </Text>
      ),
      render: (data: InternalTransaction) => (
        <Text size="small">
          <Address address={data.from} />
        </Text>
      ),
    },
    {
      property: "to",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          To
        </Text>
      ),
      render: (data: InternalTransaction) => (
        <Text size="small">
          <Address address={data.to} />
        </Text>
      ),
    },
    {
      property: "value",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          ONEValue
        </Text>
      ),
      render: (data: InternalTransaction) => (
        <Box justify="center" align="end">
          <ONEValue value={data.value} timestamp={timestamp} />
        </Box>
      ),
    },
  ];
}
