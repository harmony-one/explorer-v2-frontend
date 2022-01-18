import React, { useEffect, useState } from "react";
import { Box, DataTable, Text, Spinner } from "grommet";
import { Block, Filter } from "src/types";
import { useHistory, useParams } from "react-router-dom";
import {
  Address,
  formatNumber,
  DateTime,
  PaginationBlockNavigator,
  PaginationRecordsPerPage,
} from "src/components/ui";
import { getBlocks } from "src/api/client";

function getColumns(props: any) {
  const { history, shardNumber } = props;
  return [
    {
      property: "shard",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Shard
        </Text>
      ),
      render: (data: Block) => <Text size="small">{shardNumber}</Text>,
    },
    {
      property: "number",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Height
        </Text>
      ),
      render: (data: Block) => (
        <Text
          size="small"
          style={{ cursor: "pointer" }}
          onClick={() => {
            history.push(`/block/${data.hash}`);
          }}
          color="brand"
        >
          {formatNumber(+data.number)}
        </Text>
      ),
    },
    {
      property: "timestamp",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Timestamp
        </Text>
      ),
      render: (data: Block) => (
        <Box direction="row" gap="xsmall">
          <DateTime date={data.timestamp} />
        </Box>
      ),
    },
    {
      property: "miner",
      primaryKey: true,
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Miner
        </Text>
      ),
      render: (data: Block) => <Address address={data.miner} />,
    },
    {
      property: "transactions",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Transactions
        </Text>
      ),
      render: (data: Block) => (
        <Text size="small">
          {data.transactions.length + data.stakingTransactions.length}
        </Text>
      ),
    },
    {
      property: "gasUsed",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Gas Used / Gas Limit
        </Text>
      ),
      render: (data: Block) => (
        <Text size="small">
          {formatNumber(+data.gasUsed)} / {formatNumber(+data.gasLimit)}
        </Text>
      ),
    },
  ];
}

export function AllBlocksTable() {
  const limitValue = localStorage.getItem("tableLimitValue");

  const initFilter: Filter = {
    offset: 0,
    limit: limitValue ? +limitValue : 10,
    orderBy: "number",
    orderDirection: "desc",
    filters: [{ type: "gte", property: "number", value: 0 }],
  };

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [filter, setFilter] = useState<Filter>(initFilter);

  // @ts-ignore
  const { shardNumber } = useParams();

  const history = useHistory();

  useEffect(() => {
    const newFilter = JSON.parse(JSON.stringify(initFilter)) as Filter;

    setFilter(newFilter);
  }, [shardNumber]);

  useEffect(() => {
    const getElements = async () => {
      try {
        let blocks = await getBlocks([+shardNumber, filter]);
        setBlocks(blocks as Block[]);
      } catch (err) {
        console.log(err);
      }
    };
    getElements();
  }, [filter]);

  if (!blocks.length) {
    return (
      <Box style={{ height: "700px" }} justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  const beginValue = blocks[0].number;
  const endValue = blocks.slice(-1)[0].number;

  return (
    <>
      <Box
        direction="row"
        justify="between"
        pad={{ bottom: "small" }}
        margin={{ bottom: "small" }}
        border={{ size: "xsmall", side: "bottom", color: "border" }}
      >
        <Text style={{ flex: "1 1 auto" }}>
          <b>{filter.limit}</b> blocks shown, from{" "}
          <b>#{formatNumber(+endValue)}</b> to{" "}
          <b>#{formatNumber(+beginValue)}</b>
        </Text>
        <PaginationBlockNavigator
          onChange={setFilter}
          filter={filter}
          totalElements={blocks.length}
          blocks={blocks}
          property="number"
        />
      </Box>
      <Box style={{ overflow: "auto" }}>
        <DataTable
          className={"g-table-header"}
          style={{ width: "100%", minWidth: "1110px" }}
          columns={getColumns({ history, shardNumber })}
          data={blocks}
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
      <Box
        direction="row"
        justify="between"
        align="center"
        margin={{ top: "medium" }}
      >
        <PaginationRecordsPerPage
          filter={filter}
          onChange={(newFilter) => {
            if (newFilter.limit !== initFilter.limit) {
              localStorage.setItem("tableLimitValue", `${newFilter.limit}`);
            }

            setFilter(newFilter);
          }}
        />
        <PaginationBlockNavigator
          blocks={blocks}
          onChange={setFilter}
          filter={filter}
          totalElements={blocks.length}
          property="number"
        />
      </Box>
    </>
  );
}
