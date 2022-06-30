import { Box, ColumnConfig, Text, Tip } from "grommet";
import React from "react";
import { Address, DateTime, ONEValue, TokenValue } from "src/components/ui";
import { Log, RelatedTransaction, Topic } from "src/types";
import { parseSuggestedEvent } from "src/web3/parseByteCode";
import styled, { css } from "styled-components";
import { ABIManager, IABI } from "src/web3/ABIManager";
import ERC721ABI from "src/web3/abi/ERC721ABI.json";
import ERC1155ABI from "src/web3/abi/ERC1155ABI.json";

const erc721ABIManager = ABIManager(ERC721ABI as IABI)
const erc1155ABIManager = ABIManager(ERC1155ABI as IABI)

export const transferSignature = erc721ABIManager.getEntryByName('Transfer')!.signature
export const transferSingleSignature = erc1155ABIManager.getEntryByName('TransferSingle')!.signature

export const erc20TransferTopic =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

export type TxDirection = 'in' | 'out' | 'self'

export const Marker = styled.div<{ direction: TxDirection }>`
  border-radius: 4px;
  padding: 6px 3px;
  width: 32px;

  text-align: center;
  font-weight: bold;
  font-size: 90%;

  ${(props) =>
  props.direction === 'self'
    ? css`
            background: ${(props) => props.theme.global.colors.backgroundBack};
    `
    : props.direction === 'out'
      ? css`
            color: ${(props) => props.theme.global.colors.warning};
            background: ${(props) => props.theme.global.colors.warningBackground};
          `
      : css`
            color: ${(props) => props.theme.global.colors.success};
            background: ${(props) => props.theme.global.colors.successBackground}
        `};
`

export const TxMethod = styled(Text)`
  width: 100px;
  display: block;
  border-radius: 4px;
  padding: 2px 4px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // background: ${(props) => props.theme.global.colors.backgroundTip};
  background-color: #EFF8FF;
  font-size: 12px;
`

export const TextEllipsis = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`


export const memo = (f: Function) => {
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
export const extractTransfer = memo((data: any) => {
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

export const extractTokenId = memo((data: any) => {
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

export const TransactionAddress = (props: { id: string, address: string, width?: string }) => {
  const { id: rootAddress, address, width = '120px' } = props
  const isRootAddress = rootAddress === address
  return <Text size="12px">
    <Address
      isShortEllipsis={true}
      address={props.address}
      color={isRootAddress ? 'text' : 'brand'}
      showLink={!isRootAddress}
      style={{ width }}
    />
  </Text>
}

export const TransferDirectionMarker = (props: { id: string, data: RelatedTransaction }) => {
  const { id, data: { from, to } } = props

  let direction: TxDirection = from === id ? 'out' : 'in'
  if (from === to) {
    direction = 'self'
  }

  return <Text size="12px">
    <Marker direction={direction}>{direction.toUpperCase()}</Marker>
  </Text>
}
