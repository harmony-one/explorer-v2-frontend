import { RelatedTransaction } from "../../types";
import dayjs from "dayjs";
import Big from "big.js";
import { calculateFee, calculateFeePriceUSD } from "../../utils/fee";
import {TRelatedTransaction} from "../../api/client.interface";
import {Erc20} from "../../hooks/ERC20_Pool";
import {ERC721} from "../../hooks/ERC721_Pool";
import {ERC1155} from "../../hooks/ERC1155_Pool";

const downloadBlob = (content: any, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Create a link to download it
  const pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
}

const convertValue = (value: string | number, precision = 18) => {
  return Big(value).div(Math.pow(10, precision)).round(precision).toString()
}

const mapRelatedTxToExport = (ownerAddress: string, tx: RelatedTransaction, onePrice: number) => {
  const txDate = dayjs(tx.timestamp)
  const isSender = ownerAddress === tx.from
  return {
    Txhash: tx.hash,
    Blockno: tx.blockNumber,
    UnixTimestamp: txDate.unix(),
    DateTime: txDate.format('YYYY-MM-DD HH:MM:ss'),
    From: tx.from,
    To: tx.to,
    ['Value_IN(ONE)']: convertValue(isSender ? '0': tx.value),
    ['Value_OUT(ONE)']: convertValue(isSender ? tx.value : '0'),
    [`CurrentValue @ $${onePrice}/ONE`]: convertValue(onePrice * +tx.value),
    ['TxnFee(ONE)']: calculateFee(tx.gas, tx.gasPrice),
    ['TxnFee(USD)']: calculateFeePriceUSD(tx.gas, tx.gasPrice, onePrice),
    Method: tx.input.slice(0, 10)
  }
}

const mapHrc20TxToExport = (ownerAddress: string, tx: any, erc20Map: Record<string, Erc20>, erc721Map: Record<string, ERC721>, erc1155Map: Record<string, ERC1155>) => {
  const txDate = dayjs(tx.timestamp)
  const token = erc20Map[tx.address] || erc721Map[tx.address] || erc1155Map[tx.address]
  const precision = token ? token.decimals : 18

  const isSender = ownerAddress === tx.from
  return {
    Txhash: tx.transactionHash,
    Blockno: tx.blockNumber,
    UnixTimestamp: txDate.unix(),
    DateTime: txDate.format('YYYY-MM-DD HH:MM:ss'),
    From: tx.from,
    To: tx.to,
    ['Value_IN']: convertValue(isSender ? '0': tx.value, precision),
    ['Value_OUT']: convertValue(isSender ? tx.value : '0', precision),
    ['TokenAddress']: tx.address,
    ['TokenName']: token ? token.name: 'N/A',
    ['TokenSymbol']: token ? token.symbol: 'N/A'
  }
}

export interface IDownloadCsvParams {
  type: TRelatedTransaction
  address: string
  txs: RelatedTransaction[]
  onePrice: number
  erc20Map: Record<string, Erc20>
  erc721Map: Record<string, ERC721>
  erc1155Map: Record<string, ERC1155>
}

export const downloadCSV = (params: IDownloadCsvParams, filename: string) => {
  const { type, address, txs, onePrice, erc20Map, erc721Map, erc1155Map } = params

  const mapTx = (tx: any) => {
    return type === 'transaction'
        ? mapRelatedTxToExport(address, tx, onePrice)
        : mapHrc20TxToExport(address, tx, erc20Map, erc721Map, erc1155Map)
  }

  const mappedTxs = txs.map((tx) => mapTx(tx))
  const header = mappedTxs.filter((_, index) => index === 0).map(item => Object.keys(item))
  const body = mappedTxs
    .map((item) => Object.values(item))

  const csv = [...header, ...body]
    .map(row =>
      row
        .map(String)  // convert every value to String
        .map((v: any) => v.replaceAll('"', '""'))  // escape double colons
        // .map((v: any) => `"${v}"`)  // quote it
        .join(', ')  // comma-separated
    ).join('\r\n');  // rows starting on new lines

  downloadBlob(csv, filename)
}
