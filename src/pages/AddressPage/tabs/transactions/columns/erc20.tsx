import { Box, ColumnConfig, Text } from "grommet";
import { Address, DateTime, TokenValue } from "../../../../../components/ui";
import { RelatedTransaction } from "../../../../../types";
import React from "react";
import { TransactionAddress, TransferDirectionMarker, TxMethod } from "./common";

export function getERC20Columns(id: string): ColumnConfig<any>[] {
  return [
    {
      property: 'hash',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: '95px' }}
        >
          Hash
        </Text>
      ),
      render: (data: any) => (
        <Address address={data.transactionHash || data.hash} type="tx" isShortEllipsis={true} style={{ width: '170px' }} />
      )
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
      property: 'from',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: '120px' }}
        >
          From
        </Text>
      ),
      render: (data: RelatedTransaction) => <TransactionAddress id={id} address={data.from} />
    },
    {
      property: 'marker',
      header: <></>,
      render: (data: RelatedTransaction) => <TransferDirectionMarker id={id} data={data} />
    },
    {
      property: 'to',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: '120px' }}
        >
          To
        </Text>
      ),
      render: (data: RelatedTransaction) => <TransactionAddress id={id} address={data.to} />
    },
    {
      property: 'value',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: '260px' }}
        >
          Value
        </Text>
      ),
      render: (data: any) => {
        const { address, value, eventType } = data

        if (!value) {
          return '?'
        }

        if (eventType === 'Approval') {
          return (
            <Box direction={'row'} gap={'4px'}>
              <TokenValue isShort={true} tokenAddress={address} value={value} />
            </Box>)
        }

        return (
          <Text size="12px">
            <TokenValue tokenAddress={address} value={value} />
          </Text>)
      }
    },
    {
      property: 'token',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: '150px' }}
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
      property: 'timestamp',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ width: '140px' }}
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
      )
    }
  ]
}
