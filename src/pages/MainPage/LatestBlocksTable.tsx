import React from "react";
import { Box, DataTable, Spinner, Text } from "grommet";
import { Block } from "src/types";
import { useHistory } from "react-router-dom";
import { formatNumber } from "src/components/ui";
import { DateTime } from "../../components/ui/DateTime";

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
      render: (data: Block) => (
        <Text
          size="small"
          onClick={() => history.push(`/blocks/shard/${data.shardNumber}`)}
          style={{ cursor: "pointer" }}
          color={"brand"}
        >
          {data.shardNumber}
        </Text>
      ),
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
      property: "timestamp",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Timestamp
        </Text>
      ),
      render: (data: Block) => (
        <Box direction="row" justify="end" gap="xsmall">
          <DateTime
            date={data.timestamp}
          />
        </Box>
      ),
    },
  ];
}

export const LatestBlocksTable = (params: { blocks: Block[] }) => {
  const history = useHistory();

  if (!params.blocks.length) {
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
        data={params.blocks}
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
};
