import { Box, ColumnConfig, Text, Tip } from "grommet";
import { Address, DateTime, ONEValue, TokenValue } from "../../../components/ui";
import { Log, RelatedTransaction, Topic } from "../../../types";
import React from "react";
import { parseSuggestedEvent } from "../../../web3/parseByteCode";
import styled, { css } from "styled-components";
import { ABIManager, IABI } from "../../../web3/ABIManager";
import ERC721ABI from "../../../web3/abi/ERC721ABI.json";
import ERC1155ABI from "../../../web3/abi/ERC1155ABI.json";

const erc721ABIManager = ABIManager(ERC721ABI as IABI)
const erc1155ABIManager = ABIManager(ERC1155ABI as IABI)

const transferSignature = erc721ABIManager.getEntryByName('Transfer')!.signature
const transferSingleSignature = erc1155ABIManager.getEntryByName('TransferSingle')!.signature

const erc20TransferTopic =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

const Marker = styled.div<{ out: boolean }>`
  border-radius: 2px;
  padding: 5px;

  text-align: center;
  font-weight: bold;

  ${(props) =>
  props.out
    ? css`
          background: rgb(239 145 62);
          color: #fff;
        `
    : css`
          background: rgba(105, 250, 189, 0.8);
          color: #1b295e;
        `};
`

const NeutralMarker = styled(Box)`
  border-radius: 2px;
  padding: 5px;

  text-align: center;
  font-weight: bold;
`

const TxMethod = styled(Text)`
  width: 100px;

  > div {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const TextEllipsis = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`


const memo = (f: Function) => {
  const cache = new Map()

  return (data: any) => {
    const hash: string = data.hash + (data.logs ? data.logs.length : '')
    if (cache.has(hash)) {
      return cache.get(hash)
    }

    const res = f(data)
    const { parsed } = res
    if (!parsed) {
      return res
    }

    cache.set(hash, res)
    return res
  }
}

// take only first related at the moment
const extractTransfer = memo((data: any) => {
  const { relatedAddress } = data
  const transferLogs = data.logs ? data.logs
    .filter((d: any) => d.topics.includes(erc20TransferTopic)) : []

  for (let i = 0; i < transferLogs.length; i++) {
    const transferLog = transferLogs[i]
    const event = parseSuggestedEvent('Transfer(address,address,uint256)', transferLog.data, transferLog.topics) || null

    if (!event) {
      continue
    }

    event.parsed['$0'] = event.parsed['$0'].toLowerCase()
    event.parsed['$1'] = event.parsed['$1'].toLowerCase()

    if (relatedAddress === event.parsed['$0'] || relatedAddress === event.parsed['$1']) {
      return {
        transferLog: transferLog || {},
        parsed: event.parsed || {}
      }
    }
  }

  return {
    transferLog: {},
    parsed: {}
  }
})

const extractTokenId = memo((data: any) => {
  const { transactionType, logs = [] } = data
  const eventType = transactionType === 'erc721' ? 'Transfer' : 'TransferSingle'
  const signature = transactionType === 'erc721' ? transferSignature : transferSingleSignature
  const abi = transactionType === 'erc721' ? erc721ABIManager : erc1155ABIManager
  const transferLogs = logs.filter(({ topics }: { topics: Topic[] }) => topics.includes(signature))
  if (transferLogs.length > 0) {
    try {
      const log = transferLogs[0]
      const [topic0, ...topics] = log.topics
      const {tokenId, id} = abi.decodeLog(eventType, log.data, topics)
      if (tokenId || id) {
        return tokenId || id
      }
    } catch (e) {
      console.error('Cannot decode log', (e as Error).message)
      return ''
    }
  }
  return ''
})

export function getERC20Columns(id: string): ColumnConfig<any>[] {
  return [
    {
      property: 'hash',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: '95px' }}
        >
          Hash
        </Text>
      ),
      render: (data: any) => (
        <Address address={data.transactionHash || data.hash} type="tx" isShortEllipsis={true} style={{ width: '170px' }} />
      )
    },
    // {
    //   property: 'event',
    //   header: (
    //     <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
    //       Event
    //     </Text>
    //   ),
    //   render: (data: any) => {
    //     const eventType = data.eventType || '-'
    //
    //     return (
    //       <Text size="12px">
    //         <NeutralMarker background={'backgroundBack'}>
    //           {eventType}
    //         </NeutralMarker>
    //       </Text>
    //     )
    //   }
    // },
    {
      property: 'from',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: '120px' }}
        >
          From
        </Text>
      ),
      render: (data: RelatedTransaction) => {
        const { from } = data
        return (
          <Text size="12px">
            <Address isShortEllipsis={true} address={from} style={{ width: '120px' }} />
          </Text>)
      }
    },
    {
      property: 'marker',
      header: <></>,
      render: (data: RelatedTransaction) => {
        const { from } = data
        return (
          <Text size="12px">
            <Marker out={from === id}>
              {from === id ? 'OUT' : 'IN'}
            </Marker>
          </Text>
        )
      }
    },
    {
      property: 'to',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: '120px' }}
        >
          To
        </Text>
      ),
      render: (data: RelatedTransaction) => {
        const { to } = data
        return (
          <Text size="12px">
            <Address isShortEllipsis={true} address={to} style={{ width: '120px' }} />
          </Text>)
      }
    },
    {
      property: 'value',
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: '320px' }}
        >
          Value
        </Text>
      ),
      render: (data: RelatedTransaction) => {
        const { address, value } = data

        if (!value) {
          return '?'
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
          style={{ fontWeight: 300, width: '120px' }}
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
          style={{ fontWeight: 300, width: '140px' }}
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

export function getColumns(id: string): ColumnConfig<any>[] {
  return [
    // {
    //   property: "type",
    //   size: "",
    //   header: (
    //     <Text
    //       color="minorText"
    //       size="small"
    //       style={{ fontWeight: 300, width: "140px" }}
    //     >
    //       Type
    //     </Text>
    //   ),
    //   render: (data: RelatedTransaction) => (
    //     <Text size="small" style={{ width: "140px" }}>
    //       {relatedTxMap[data.transactionType] || data.transactionType}
    //     </Text>
    //   ),
    // },
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
          type="tx"
          isShortEllipsis={true}
          style={{ width: "170px" }}
        />
      ),
    },
    {
      property: "method",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Method
        </Text>
      ),
      render: (data: any) => {
        const { eventType } = data
        let signature;

        if (eventType) {
          signature = eventType
        } else {
          try {
            // @ts-ignore
            signature =
              data.signatures &&
              data.signatures.map((s: any) => s.signature)[0].split("(")[0];
          } catch (err) {}

          if (!signature && data.value !== "0") {
            signature = "transfer";
          }
        }

        if (!signature) {
          return <Text size="small">{"—"}</Text>;
        }

        return (
          <Tip content={<span>{signature}</span>}>
            <TxMethod size="10px">
              <NeutralMarker background={"backgroundBack"}>
                {signature}
              </NeutralMarker>
            </TxMethod>
          </Tip>
        );
      },
    },
    // {
    //   property: "shard",
    //   header: (
    //     <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
    //       Shard
    //     </Text>
    //   ),
    //   render: (data: RelatedTransaction) => (
    //     <Box direction="row" gap="3px" align="center">
    //       <Text size="small">{0}</Text>
    //       <FormNextLink
    //         size="small"
    //         color="brand"
    //         style={{ marginBottom: "2px" }}
    //       />
    //       <Text size="small">{0}</Text>
    //     </Box>
    //   ),
    // },
    {
      property: "from",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "180px" }}
        >
          From
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          <Address address={data.from} isShortEllipsis={true} style={{ width: '180px' }} />
        </Text>
      ),
    },
    {
      property: "marker",
      header: <></>,
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          <Marker out={data.from === id}>
            {data.from === id ? "OUT" : "IN"}
          </Marker>
        </Text>
      ),
    },
    {
      property: "to",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "180px" }}
        >
          To
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          <Address address={data.to} isShortEllipsis={true} style={{ width: '180px' }} />
        </Text>
      ),
    },
    {
      property: "value",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "120px" }}
        >
          Value
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Box justify="center">
          <ONEValue value={data.value} timestamp={data.timestamp} />
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
          <DateTime
            date={data.timestamp}
          />
        </Box>
      ),
    },
  ];
}

export function getNFTColumns(id: string): ColumnConfig<any>[] {
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
          type="tx"
          isShortEllipsis={true}
          style={{ width: "170px" }}
        />
      ),
    },
    {
      property: "from",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "180px" }}
        >
          From
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          <Address address={data.from} isShortEllipsis={true} style={{ width: '180px' }} />
        </Text>
      ),
    },
    {
      property: "marker",
      header: <></>,
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          <Marker out={data.from === id}>
            {data.from === id ? "OUT" : "IN"}
          </Marker>
        </Text>
      ),
    },
    {
      property: "to",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "180px" }}
        >
          To
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          <Address address={data.to} isShortEllipsis={true} style={{ width: '180px' }} />
        </Text>
      ),
    },
    // {
    //   property: "value",
    //   header: (
    //     <Text
    //       color="minorText"
    //       size="small"
    //       style={{ fontWeight: 300, width: "120px" }}
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
          style={{ fontWeight: 300, width: '120px' }}
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
          style={{ fontWeight: 300, width: '120px' }}
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
          style={{ fontWeight: 300, width: "140px" }}
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

export const getStackingColumns = (id: string): ColumnConfig<any>[] => {
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
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          {data.msg?.validatorAddress ? (
            <Address address={data.msg?.validatorAddress || data.from} isShortEllipsis={true} style={{ width: "170px" }} />
          ) : (
            "—"
          )}
        </Text>
      ),
    },
    {
      property: "marker",
      header: <></>,
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          <Marker out={data.from === id}>
            {data.from === id ? "OUT" : "IN"}
          </Marker>
        </Text>
      ),
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
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          {data.msg?.delegatorAddress ? (
            <Address address={data.msg?.delegatorAddress} isShortEllipsis={true} style={{ width: "170px" }} />
          ) : (
            "—"
          )}
        </Text>
      ),
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
