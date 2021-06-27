import React, { useEffect, useState } from "react";

import { Box, DataTable, Spinner, Text } from "grommet";
import { RPCTransactionHarmony } from "src/types";
import { useHistory } from "react-router-dom";
import { RelativeTimer, Address } from "src/components/ui";
import { getTransactions } from "src/api/client";
import { FormNextLink } from "grommet-icons";

function getColumns(props: any) {
  const { history } = props;
  return [
    {
      property: "shard",
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
          <Address address={data.hash} isShort noHistoryPush />
        </Text>
      ),
    },
    {
      property: "from",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          From
        </Text>
      ),
      render: (data: RPCTransactionHarmony) => (
        <Address address={data.from} isShort />
      ),
    },
    {
      property: "to",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          To
        </Text>
      ),
      render: (data: RPCTransactionHarmony) => (
        <Address address={data.to} isShort />
      ),
    },
    {
      property: "age",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Timestamp
        </Text>
      ),
      render: (data: RPCTransactionHarmony) => (
        <RelativeTimer
          date={new Date(data.timestamp)}
          updateInterval={1000}
          style={{ textAlign: "right" }}
        />
      ),
    },
  ];
}

const filter = {
  offset: 0,
  limit: 10,
  orderBy: "block_number",
  orderDirection: "desc",
  value: 0,
  filters: [],
};

export function LatestTransactionsTable() {
  const history = useHistory();
  const [transactions, setTransactions] = useState<RPCTransactionHarmony[]>([]);
  const availableShards = (process.env.REACT_APP_AVAILABLE_SHARDS as string)
    .split(",")
    .map((t) => +t);

  useEffect(() => {
    let tId = 0 as any;
    const exec = async () => {
      try {
        let trxs = await Promise.all(
          availableShards.map((shardNumber) =>
            getTransactions([shardNumber, filter])
          )
        );

        const trxsList = trxs.reduce((prev, cur) => {
          prev = [...prev, ...cur];
          return prev;
        }, []);

        setTransactions(
          trxsList
            .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
            .slice(0, 10) as RPCTransactionHarmony[]
        );
      } catch (err) {
        console.log(err);
      }
    };

    exec();
    tId = window.setInterval(exec, 3000);

    return () => {
      clearTimeout(tId);
    };
  }, []);

  if (!transactions.length) {
    return (
      <Box style={{ height: "700px" }} justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box style={{ overflow: "auto" }}>
      <DataTable
        className={"g-table-header"}
        style={{ width: "100%", minWidth: "620px" }}
        columns={getColumns({ history })}
        data={transactions}
        step={10}
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
  );
}
