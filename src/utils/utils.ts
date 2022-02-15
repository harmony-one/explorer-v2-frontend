import dayjs from "dayjs";
import { RelatedTransaction, RelatedTransactionType, RPCTransactionHarmony } from "../types";
import { getAddress } from "./getAddress/GetAddress";
import { bridgeTokensMap } from "src/config";

export const getQueryVariable = (variable: string, query: string) => {
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
};

export const mapBlockchainTxToRelated = (
  tx: RPCTransactionHarmony,
  type: RelatedTransactionType = 'transaction'
): RelatedTransaction => {
  const resultedTx = {
    ...tx,
    transactionType: type,
    address: '',
    transactionHash: tx.ethHash || tx.hash,
    timestamp: dayjs(+tx.timestamp * 1000).toString()
  }
  if (tx.from) {
    resultedTx.from = getAddress(tx.from).basicHex
  }
  if (tx.to) {
    resultedTx.to = getAddress(tx.to).basicHex
  }
  if (typeof tx.value !== 'undefined') {
    resultedTx.value = BigInt(tx.value).toString()
  }
  return resultedTx
}

export const isTokenBridged = (address: string) => !!bridgeTokensMap[address]
