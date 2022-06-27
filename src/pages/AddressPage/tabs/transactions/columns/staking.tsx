import { Box, ColumnConfig, Text } from "grommet";
import React from "react";
import { RelatedTransaction } from "../../../../../types";
import { Address, DateTime, ONEValue } from "../../../../../components/ui";
import { TransactionAddress, TransferDirectionMarker } from "./common";

export const getStakingColumns = (id: string): ColumnConfig<any>[] => {
  return [
    {
      property: "hash",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "95px" }}
        >
          Hash
        </Text>
      ),
      render: (data: any) => (
        <Address
          address={data.transactionHash || data.hash}
          type="staking-tx"
          isShortEllipsis={true}
          style={{ width: "170px" }}
        />
      ),
    },
    {
      property: "type",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "140px" }}
        >
          Type
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Text size="small" style={{ width: "140px" }}>
          {data.type}
        </Text>
      ),
    },
    {
      property: "validator",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "170px" }}
        >
          Validator
        </Text>
      ),
      render: (data: RelatedTransaction) => data.msg?.validatorAddress
        ? <TransactionAddress id={id} address={data.msg?.validatorAddress || data.from} width={'170px'} />
        : '—'
    },
    {
      property: "marker",
      header: <></>,
      render: (data: RelatedTransaction) => <TransferDirectionMarker id={id} data={data} />,
    },
    {
      property: "delegator",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "170px" }}
        >
          Delegator
        </Text>
      ),
      render: (data: RelatedTransaction) => data.msg?.delegatorAddress
        ? <TransactionAddress id={id} address={data.msg?.delegatorAddress} width={'170px'} />
        : '—',
    },
    {
      property: "value",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "220px" }}
        >
          Value
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Box justify="center">
          {data.msg?.amount ? (
            <ONEValue value={data.msg?.amount} timestamp={data.timestamp} />
          ) : data.amount ? (
            <ONEValue value={data.amount} timestamp={data.timestamp} />
          ) : (
            "—"
          )}
        </Box>
      ),
    },
    {
      property: "timestamp",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "140px" }}
        >
          Timestamp
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Box direction="row" gap="xsmall" justify="end">
          <DateTime date={data.timestamp} />
        </Box>
      ),
    },
  ];
};
