import { RelatedTransaction } from "../../types";
import dayjs from "dayjs";
import { calculateFee, calculateFeePriceUSD } from "../../utils/fee";

const downloadBlob = (content: any, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Create a link to download it
  const pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
}

const mapRelatedTxToExport = (ownerAddress: string, tx: RelatedTransaction, onePrice: number) => {
  const txDate = dayjs(tx.timestamp)

  const convertValue = (value: string | number, n = 4) => {
    const precision = 18
    const bigIntValue = BigInt(parseInt(value.toString())) / BigInt(10 ** (precision - n))
    return parseInt(bigIntValue.toString()) / (10 ** n);
  }

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

export interface IDownloadCsvParams {
  address: string
  txs: RelatedTransaction[]
  onePrice: number
}

export const downloadCSV = (params: IDownloadCsvParams, filename: string) => {
  const { address, txs, onePrice} = params
  const mappedTxs = txs.map((tx) => mapRelatedTxToExport(address, tx, onePrice))
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
