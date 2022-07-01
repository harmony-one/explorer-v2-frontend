import { Box, ColumnConfig, Text, Tip } from "grommet";
import React from "react";
import { RelatedTransaction } from "../../../../../types";
import { Address, DateTime } from "../../../../../components/ui";
import {
  extractTokenId,
  TextEllipsis,
  TransactionAddress,
  TransferDirectionMarker,
  TxMethod
} from "./common";

export function getNFTColumns(id: string): ColumnConfig<any>[] {
  return [
    {
      property: "hash",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: "95px" }}
        >
          Hash
        </Text>
      ),
      render: (data: any) => (
        <Address
          address={data.transactionHash || data.hash}
          type="tx"
          isShortEllipsis={true}
          style={{ width: "170px" }}
        />
      ),
    },
    {
      property: 'event',
      header: (
        <Text color="minorText" size="small">
          Event
        </Text>
      ),
      render: (data: any) => {
        const eventType = data.eventType || '-'
        return (
          <TxMethod>{eventType}</TxMethod>
        )
      }
    },
    {
      property: "from",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: "180px" }}
        >
          From
        </Text>
      ),
      render: (data: RelatedTransaction) => <TransactionAddress id={id} address={data.from} width={'180px'} />,
    },
    {
      property: "marker",
      header: <></>,
      render: (data: RelatedTransaction) => <TransferDirectionMarker id={id} data={data} />,
    },
    {
      property: "to",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: "180px" }}
        >
          To
        </Text>
      ),
      render: (data: RelatedTransaction) => data.to.trim() && <TransactionAddress id={id} address={data.to} width={'180px'} />,
    },
    // {
    //   property: "value",
    //   header: (
    //     <Text
    //       color="minorText"
    //       size="small"
    //       style={{ width: "120px" }}
    //     >
    //       Value
    //     </Text>
    //   ),
    //   render: (data: RelatedTransaction) => (
    //     <Box justify="center">
    //       <ONEValue value={data.value} timestamp={data.timestamp} />
    //     </Box>
    //   ),
    // },
    {
      property: 'tokenId',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: '120px' }}
        >
          TokenId
        </Text>
      ),
      render: (data: any) => {
        const tokenId = extractTokenId(data)
        return (
          <Tip content={tokenId}>
            <TextEllipsis size="12px" style={{ width: '115px' }}>
              {tokenId}
            </TextEllipsis>
          </Tip>
        )
      }
    },
    {
      property: 'token',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: '120px' }}
        >
          Token
        </Text>
      ),
      render: (data: any) => {
        const address = data.address ? data.address : '—'

        return (
          <Text size="12px">
            <Address address={address} />
          </Text>
        )
      }
    },
    {
      property: "timestamp",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: "140px" }}
        >
          Timestamp
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Box direction="row" gap="xsmall" justify="end">
          <DateTime
            date={data.timestamp}
          />
        </Box>
      ),
    },
  ];
}
